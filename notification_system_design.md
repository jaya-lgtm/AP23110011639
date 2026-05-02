Stage 1:-
# Stage 1: Notification System API Design

## Core Features
- Fetch notifications
- Send notifications
- Mark notifications as read
- Real-time updates

---

## GET /notifications

### Description
Fetch notifications for a user

### Headers
Authorization: Bearer <token>

### Query Params
- userId
- page
- limit

### Response
{
  "notifications": [
    {
      "id": "uuid",
      "type": "Placement",
      "message": "Company hiring",
      "isRead": false,
      "createdAt": "timestamp"
    }
  ]
}

---

## POST /notifications

### Description
Create a notification

{
  "userId": "123",
  "type": "Result",
  "message": "Results announced"
}

---

## PATCH /notifications/:id

### Description
Mark notification as read

{
  "isRead": true
}

---

## Real-Time Notifications
Use WebSockets or Server-Sent Events for instant updates.



Stage 2:-
# Stage 2: Database Design

## Database Choice
PostgreSQL (Relational DB)

### Why?
- Structured schema
- Strong consistency (ACID)
- Supports indexing

---

## Table: notifications

| Column      | Type        |
|------------|------------|
| id         | UUID (PK)  |
| user_id    | VARCHAR    |
| type       | ENUM       |
| message    | TEXT       |
| is_read    | BOOLEAN    |
| created_at | TIMESTAMP  |

---

## Scaling Problems
- Large data volume
- Slow queries

---

## Solutions
- Indexing
- Partitioning
- Archiving old data



stage 3:-
# Stage 3: Query Optimization

## Given Query

SELECT * FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt DESC;

---

## Problems
- Full table scan
- Slow sorting
- No indexing

---

## Solution

CREATE INDEX idx_notifications
ON notifications(studentID, isRead, createdAt DESC);

---

## Complexity
Before: O(N)  
After: O(log N)

---

## Indexing Every Column?

No:
- Slows writes
- Increases memory

---

## Placement Query

SELECT *
FROM notifications
WHERE type = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 days';


stage 4:-
# Stage 4: Performance Optimization

## Problem
Frequent DB calls causing slow response

---

## Solutions

### Pagination
LIMIT & OFFSET

### Caching (Redis)
Store frequently used data

### Lazy Loading
Load data only when needed

### Read Replicas
Separate read/write operations

---

## Trade-offs

| Method   | Pros  | Cons |
|----------|------|------|
| Cache    | Fast | Stale data |
| Replica  | Scalable | Cost |


stage 5:-
# Stage 5: Reliable Notification System

## Problems
- Sequential execution (slow)
- No retry mechanism
- Failure breaks flow

---

## Solution: Queue-Based System

Use Kafka or RabbitMQ

---

## Flow
1. Save to DB
2. Push to queue
3. Worker processes:
   - Send email
   - Push notification

---

## Improved Pseudocode

function notify_all(student_ids, message):
    for id in student_ids:
        save_to_db(id, message)
        push_to_queue(id, message)

worker():
    while true:
        process job
        send_email()
        push_to_app()

---

## Why separate DB and email?
- DB must always succeed
- Email can retry later


Stage 6:-
# Stage 6: Priority Notifications

## Goal
Show top 10 important notifications

---

## Priority Order
Placement > Result > Event

---

## Approach
Assign weights:
- Placement = 3
- Result = 2
- Event = 1

Final Score:
priority_weight + recency

---

## Efficient Solution
Use Max Heap (Priority Queue)

---

## Handling New Notifications
Maintain heap of size 10:
- Insert new notification
- Remove lowest priority

---

## Complexity
O(log n)