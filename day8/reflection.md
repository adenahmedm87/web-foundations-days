# Day 8 Reflection

The most difficult concept for me was understanding how a system keeps data correct when many people make requests at the same time. Two customers can see the same available seat, but only one should be able to reserve it. Working through Alice and Brian's competing requests helped me understand row locks. I connected this to transactions and unique constraints: the transaction protects the booking process, while the unique constraint prevents a second ticket for the same seat.

The feedback on my TicketHub submission praised the traffic calculations and fairness requirements, but said the document stopped during the API section. The later sections were present in the repository, so I would improve how the complete design is presented and checked before submission. In this rework, I shortened the API table, added a section map and an explicit SQL schema, and made the double-booking steps easier to find. I would apply the same lesson to my capstone by checking the final files and making each design decision easy for a reviewer to follow.

Next, I plan to learn Node.js, Express and PostgreSQL. I want to build a small backend and test simultaneous requests for one seat. This will help me move from explaining a design to checking that its behaviour matches the promise.
