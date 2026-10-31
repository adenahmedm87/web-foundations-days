# Day 8 Reflection

The most difficult concept for me is understanding how a system keeps data correct when many people send requests at the same time. A seat may look available to two customers, but only one should be allowed to buy it. Working through the TicketHub design helped me break this problem into smaller steps: lock the seat row, check its state, update it and commit the transaction. Connecting this process to primary keys, foreign keys and unique constraints made the purpose of database rules clearer to me.

For my capstone, I would improve the explanation of how the interface, API and database work together. I would demonstrate a successful request and an error case, then show the request and response in the browser's Network tab. Specific feedback from my own presentation has not been provided here, so this improvement is based on the course's review criteria and sample feedback rather than a comment I can claim to have received. I would also make the architecture diagram easier to explain by giving a clear reason for every component.

Next, I plan to learn Node.js and Express, followed by PostgreSQL. I want to turn API designs into working endpoints, store data reliably and practise handling errors. Building a small backend will help me connect the design concepts to code I can test and improve.
