
# SnapShare: Scaling Plan

## 1. Assumptions

SnapShare is a photo-sharing application where users upload photos and view feed pages from people they follow.

The following assumptions are used:

- Registered users: 10,000,000
- Daily active users: 10% of registered users
- Photos uploaded per active user per day: 1
- Feed pages viewed per active user per day: 50
- Average original photo size: 2 MB
- Average thumbnail size: 50 KB
- Seconds per day: approximately 100,000 for easy calculations
- Peak traffic: 5 times the average traffic

## 2. Load Estimates

### Daily active users

10,000,000 × 10% = 1,000,000 daily active users.

### Photo uploads per second

Daily uploads:

1,000,000 users × 1 photo = 1,000,000 uploads per day.

Average uploads per second:

1,000,000 ÷ 100,000 ≈ 10 uploads per second.

Peak uploads per second:

10 × 5 = 50 uploads per second.

### Feed views per second

Daily feed views:

1,000,000 users × 50 views = 50,000,000 feed views per day.

Average feed views per second:

50,000,000 ÷ 100,000 ≈ 500 feed views per second.

Peak feed views per second:

500 × 5 = 2,500 feed views per second.

### Photo storage per year

Original photos per day:

1,000,000 × 2 MB = 2,000,000 MB per day.

This is approximately 2,000 GB or 2 TB per day.

Original photo storage per year:

2 TB × 365 = 730 TB per year.

Thumbnail storage per day:

1,000,000 × 50 KB = 50,000,000 KB per day.

This is approximately 50 GB per day.

Thumbnail storage per year:

50 GB × 365 = 18.25 TB per year.

Total storage per year:

730 TB + 18.25 TB = 748.25 TB per year.

These estimates exclude database records, backups, replication overhead and any extra copies of the photos.

## 3. Read-Heavy or Write-Heavy?

SnapShare is a read-heavy system because users view 50 feed pages per day but upload only one photo per day.

The design should therefore optimise feed loading using caching, a CDN and database read replicas. Photo uploads must also be handled reliably without slowing down users who are browsing their feeds.

## 4. Where Should Photos Be Stored?

Photo files should be stored in object storage, such as Amazon S3, rather than directly inside the database.

Object storage is designed to store large files and can scale to very large amounts of data. The database should store photo metadata, such as the photo ID, owner ID, caption, upload time and object-storage key.

The CDN can deliver frequently requested photos and thumbnails quickly to users in different locations.

## 5. Architecture Diagram

```text
                         USERS
                           |
                           v
                          DNS
                           |
             +-------------+-------------+
             |                           |
             v                           v
       CDN: static files           CDN: photos
       and thumbnails              and cached media
             |                           |
             +-------------+-------------+
                           |
                           v
                    LOAD BALANCER
                           |
                +----------+----------+
                |          |          |
                v          v          v
             APP 1       APP 2      APP 3
                |          |          |
                +----------+----------+
                           |
               +-----------+-----------+
               |           |           |
               v           v           v
            CACHE       DATABASE     OBJECT
           (Redis)      PRIMARY      STORAGE
                           |          Photos
                           |          and files
                           v
                      READ REPLICA

             APP SERVERS
                  |
                  v
             MESSAGE QUEUE
                  |
                  v
            THUMBNAIL WORKER
                  |
                  v
        OBJECT STORAGE: THUMBNAILS
```

## 6. What Each Component Does

- DNS: Translates SnapShare's domain name into the appropriate server address.
- CDN: Delivers static files, photos and thumbnails from nearby edge servers to reduce latency and origin-server load.
- Load balancer: Distributes incoming application requests across healthy application servers.
- App servers: Handle authentication, photo uploads, feed requests and application logic.
- Cache (Redis): Stores frequently requested feed data and metadata in memory to reduce database queries.
- Primary database: Stores authoritative photo metadata, user information and relationships.
- Read replica: Handles database read queries to reduce the workload on the primary database.
- Object storage: Stores original photos and generated thumbnail files separately from the database.
- Message queue: Holds thumbnail-generation jobs so they can be processed asynchronously.
- Thumbnail worker: Processes queued jobs, creates smaller photo versions and saves the thumbnails to object storage.

## 7. Photo Upload Flow

1. The user selects a photo and submits it through the SnapShare application.
2. The request reaches a healthy application server through the load balancer.
3. The application server authenticates the user and validates the photo type, size and upload permissions.
4. The original photo is uploaded to object storage, using a unique storage key.
5. The application saves the photo metadata and storage key in the primary database.
6. The application places a thumbnail-generation job in the message queue.
7. The application responds to the user that the upload has been accepted or completed, according to the API's actual processing status.
8. A background worker retrieves the job and creates a smaller thumbnail.
9. The worker saves the thumbnail to object storage and updates the relevant metadata if necessary.
10. The CDN can deliver the original photo and thumbnail to users. Feed requests use the cache and read replica where appropriate.

If thumbnail generation fails, the job can be retried with a limit and appropriate back-off.

## 8. Trade-offs

### Speed versus freshness

Caching makes feeds load faster and reduces database traffic. However, a cached feed may temporarily show outdated information. SnapShare can invalidate or refresh cached feed data when new photos are uploaded.

### Cost versus performance

A CDN and Redis cache improve performance, but they introduce additional costs. The application should cache frequently requested content and monitor cache hit rates to justify the expense.

### Availability versus complexity

Multiple application servers and a load balancer help the service continue working when one server fails. However, multiple servers require health checks, monitoring and additional infrastructure.

### Asynchronous processing versus immediate results

A message queue allows photo uploads to proceed without waiting for thumbnail generation. However, thumbnails may not be available immediately, so the interface should handle processing and failure states.

## 9. Avoiding Single Points of Failure

SnapShare should run multiple application servers behind a health-checking load balancer. The database should have a read replica and a tested failover plan. The queue and background workers should support retries and recovery. Object storage should use appropriate durability, access controls and backup or recovery arrangements. Monitoring and alerts should help engineers identify failures quickly.

## Conclusion

SnapShare needs a scalable architecture because it serves one million daily active users, approximately 500 average feed views per second and about 748.25 TB of new photo and thumbnail data per year under the stated assumptions.

A CDN, caching, multiple application servers, database read replicas, object storage and asynchronous thumbnail workers help the system handle heavy read traffic while keeping uploads reliable.
