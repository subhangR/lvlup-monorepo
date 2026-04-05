# Design a Dating App Like Tinder - System Design

**Source:** Hello Interview (hellointerview.com) **Author:** Joseph Antonakakis
**Published:** Jul 20, 2024 **Difficulty:** Medium **Asked at:** Various
companies

---

## Understand the Problem

Tinder is a mobile dating app that helps people connect by allowing users to
swipe right to like or left to pass on profiles. It uses location data and
user-specified filters to suggest potential matches nearby.

---

## Functional Requirements

### Core Requirements

1. Users can create a profile with preferences (e.g. age range, interests) and
   specify a maximum distance.
2. Users can view a stack of potential matches in line with their preferences
   and within max distance of their current location.
3. Users can swipe right / left on profiles one-by-one, to express "yes" or "no"
   on other users.
4. Users get a match notification if they mutually swipe on each other.

### Below the Line (Out of Scope)

- Users should be able to upload pictures.
- Users should be able to chat via DM after matching.
- Users can send "super swipes" or purchase other premium features.

> **Note:** This question is mostly focused on the user recommendation "feed"
> and swiping experience, not on other auxiliary features. If you're unsure what
> features to focus on, have some brief back and forth with the interviewer to
> figure out what part of the system they care the most about. It'll typically
> be the functionality that makes the app unique or the most complex.

---

## Non-Functional Requirements

### Core Requirements

- **Strong consistency for swiping:** If a user swipes "yes" on a user who
  already swiped "yes" on them, they should get a match notification.
- **Scale:** ~20M daily actives, ~100 swipes/user/day on average.
- **Low latency stack loading:** e.g. < 300ms.
- **No repeat profiles:** The system should avoid showing user profiles that the
  user has previously swiped on.

### Below the Line (Out of Scope)

- Protection against fake profiles.
- Monitoring / alerting.

---

## The Set Up

### Planning the Approach

Build the design up sequentially, going one by one through functional
requirements. Once functional requirements are satisfied, use non-functional
requirements to guide deep dives.

### Core Entities

- **User:** Represents both a user using the app and a profile that might be
  shown to the user. We typically omit the "user" concept when listing entities,
  but because users are swiping on other users, we'll include it here.
- **Swipe:** Expression of "yes" or "no" on a user profile; belongs to a user
  (`swiping_user`) and is about another user (`target_user`).
- **Match:** A connection between 2 users as a result of them both swiping "yes"
  on each other.

### The API

**1. Create Profile:**

```
POST /profile
{
  "age_min": 20,
  "age_max": 30,
  "distance": 10,
  "interestedIn": "female" | "male" | "both",
  ...
}
```

**2. Get Feed (stack of profiles to swipe on):**

```
GET /feed?lat={}&long={}&distance={} -> User[]
```

- No need to pass filters like age, interests - loaded server-side from user
  settings.
- Location passed client-side since it can always change.
- No pagination needed - app just hits the endpoint again for more
  recommendations if exhausted. This is actually superfluous for Tinder because
  we're really generating recommendations, not "paging".

**3. Record Swipe:**

```
POST /swipe/{userId}
{
  decision: "yes" | "no"
}
```

- User info passed in headers (session token or JWT), not request body. Avoid
  passing user information in the request body as this can be easily manipulated
  by the client.
- All endpoints require authentication.

---

## High-Level Design

### 1) Users can create a profile with preferences

Simple client-server-database architecture:

- **Client** -> **API Gateway** -> **Profile Service** -> **Database**

Components:

- **Client:** Users interact with the system through a mobile application.
- **API Gateway:** Routes incoming requests to the appropriate services.
- **Profile Service:** Handles incoming profile requests by updating the user's
  profile preferences in the database.
- **Database:** Stores information about user profiles, preferences, and other
  relevant information.

Flow:

1. Client sends POST request to `/profile` with profile information as the
   request body.
2. API Gateway routes this request to the Profile Service.
3. Profile Service updates user's profile preferences in database.
4. Results returned to client via API Gateway.

### 2) Users can view a stack of potential matches

When a user enters the app, they're immediately served a stack of profiles to
swipe on, filtered by user-specified preferences and location.

Simple query approach:

```sql
SELECT * FROM users
WHERE age BETWEEN 18 AND 35
AND interestedIn = 'female'
AND lat BETWEEN userLat - maxDistance AND userLat + maxDistance
AND long BETWEEN userLong - maxDistance AND userLong + maxDistance
```

Flow:

1. Client sends GET request to `/feed` with user's location as a query
   parameter.
2. API Gateway routes to Profile Service.
3. Profile Service queries User Database for a list of users that match the
   user's preferences and location.
4. Results returned to client via API Gateway.

> **Warning:** This query would be incredibly inefficient. Searching by location
> in particular, even with basic indexing, would be incredibly slow. We'll need
> to look into more sophisticated indexing and querying techniques to improve
> the performance during our deep dives.

### 3) Users can swipe right / left on profiles

Two new components introduced:

- **Swipe Service:** Persists swipes and checks for matches.
- **Swipe Database (Cassandra):** Stores swipe data for users.

**Why separate service and DB?**

- Profile view/creation happens far less frequently than swipe writes. By
  separating the services, we allow for the swipe service to scale up
  independently.
- Massive swipe data volume: 20M DAU x 200 swipes/day x 184 bytes per swipe =
  ~200GB/day.
- Write-optimized database (Cassandra) may not be right fit for profile
  database. Separating allows us to scale and optimize swipe operations
  independently.
- Enables swipe-specific logic and caching strategies without affecting the
  profile service.

**Why Cassandra?**

- Partition by `swiping_user_id` - fast access pattern to check if user A swiped
  on user B (predictably query a single partition).
- Extremely capable of massive writes due to its write-optimized storage engine
  (CommitLog + Memtables + SSTables).
- **Con:** Element of eventual consistency of swipe data we inherit from using
  it (addressed in deep dives).

Flow:

1. Client sends POST to `/swipe` with profile ID and swipe direction (right or
   left) as parameters.
2. API Gateway routes to Swipe Service.
3. Swipe Service updates Swipe Database with the swipe data.
4. Swipe Service checks if there is an inverse swipe in the Swipe Database and,
   if so, returns a match to the client.

### 4) Users get a match notification if they mutually swipe

- **Person B (second swiper):** Immediately shown "You Matched!" graphic after
  swiping right (we already check for inverse swipe).
- **Person A (first swiper):** They might have swiped weeks ago. Send push
  notification via **APNS** (Apple Push Notification Service) or **FCM**
  (Firebase Cloud Messaging).

Full swipe + match flow:

1. Some time in the past, Person A swiped right on Person B and we persisted
   this swipe in our Swipe DB.
2. Person B swipes right on Person A.
3. The server checks for an inverse swipe and finds that it does, indeed, exist.
4. We display a "You Matched!" message to Person B immediately after swiping.
5. We send a push notification via APNS or FCM to Person A informing them that
   they have a new match.

> **Assumption:** We can avoid diving into the match storage details and assume
> an external service can support push notifications. Be sure to clarify these
> assumptions with your interviewer!

---

## Potential Deep Dives

At this point, we have a basic, functioning system that satisfies the functional
requirements. However, there are a number of areas we could dive deeper into to
improve the system's performance, scalability, etc. Depending on your seniority,
you'll be expected to drive the conversation toward these deeper topics of
interest.

---

### Deep Dive 1: How can we ensure that swiping is consistent and low latency?

**The Problem (Race Condition):** Imagine Person A and Person B both swipe right
(like) on each other at roughly the same time:

1. Person A swipe hits server - check for inverse swipe - nothing found.
2. Person B swipe hits server - check for inverse swipe - nothing found.
3. Save Person A's swipe on Person B.
4. Save Person B's swipe on Person A.

Result: Both swipes saved, but the match opportunity was lost. They will both go
on forever not knowing that they matched and true love may never be discovered.

> **Trade-off discussion:** You could solve this without strong consistency
> using a periodic reconciliation process that runs periodically to ensure all
> matching swipes have been processed. For those that haven't, just send both
> persons a notification. This prioritizes availability over consistency - an
> interesting trade-off to discuss, but interviewers typically suggest you stick
> with prioritizing consistency.

---

#### Bad Solution: Database Polling for Matches

**Approach:** Periodically poll the database to check for reciprocal swipes and
create matches accordingly. This obviously does not meet our requirement of
being able to notify users of a match immediately, so it's a non-starter, though
worth mentioning.

**Challenges:** This approach introduces latency due to the intervals between
polls, meaning users would not receive immediate feedback upon swiping. The lack
of instant gratification can significantly diminish user engagement, as the
timely dopamine hit associated with immediate match notifications is a critical
component of the user experience. Additionally, frequent polling can place
unnecessary load on the database, leading to scalability issues.

---

#### Good Solution: Transactions

**Approach:** Use database transactions to make sure that both the swipe and the
check for a reciprocal swipe happen in the same transaction, so that we either
successfully save both or neither.

Cassandra does have basic support for "lightweight transactions" (LWT), but they
are not as powerful as true ACID transactions. LWTs use a Paxos consensus
protocol to provide linearizable consistency for specific operations, but only
within a single partition. Unlike true ACID transactions, they don't support
multi-partition atomicity, isolation levels, or rollbacks. They also come with
significant performance overhead since they require multiple round trips between
nodes to achieve consensus. This makes them suitable for simple conditional
updates but not complex transactional workflows.

**Challenges:** The main challenge becomes an issue of scale. With 20M DAU and
100 swipes per day, that's 2B swipes a day! There is no way this all fits on a
single partition which means that transactions will need to span multiple
partitions (something unsupported by LWTs).

---

#### Great Solution: Sharded Cassandra with Single-Partition Transactions

**Approach:** Leverage Cassandra's single-partition transactions to atomically
handle swipes. The key is to ensure that all swipes between two users are stored
in the same partition.

First, create a table with a compound primary key that ensures swipes between
the same users are in one partition:

```sql
CREATE TABLE swipes (
    user_pair text,      -- partition key: smaller_id:larger_id
    from_user uuid,      -- clustering key
    to_user uuid,        -- clustering key
    direction text,
    created_at timestamp,
    PRIMARY KEY ((user_pair), from_user, to_user)
);
```

When a user swipes, create the `user_pair` key by sorting the IDs to ensure
consistency:

```python
def get_user_pair(user_a, user_b):
    # Sort IDs so (A->B) and (B->A) are in same partition
    sorted_ids = sorted([user_a, user_b])
    return f"{sorted_ids[0]}:{sorted_ids[1]}"

def handle_swipe(from_user, to_user, direction):
    user_pair = get_user_pair(from_user, to_user)

    # Both operations happen atomically in same partition
    batch = """
    BEGIN BATCH
        INSERT INTO swipes (user_pair, from_user, to_user, direction, created_at)
        VALUES (?, ?, ?, ?, ?);

        SELECT direction FROM swipes
        WHERE user_pair = ?
        AND from_user = ?
        AND to_user = ?;
    APPLY BATCH;
    """
```

This approach is effective because Cassandra's single-partition transactions
provide the atomicity guarantees we need. By ensuring all swipes between two
users are stored in the same partition, we can atomically check for matches
without worrying about distributed transaction complexities. The partition key
design eliminates the need for cross-partition operations, making the solution
both performant and reliable.

**Challenges:** As user pairs accumulate swipe history over time, partition
sizes can grow significantly, potentially impacting performance. Additionally,
highly active users could create hot partitions that receive a disproportionate
amount of traffic. Need a robust cleanup strategy to archive or delete old swipe
data, preventing partitions from growing unbounded while preserving important
historical data.

---

#### Great Solution: Redis for Atomic Operations

**Approach:** Redis is a better fit for handling the consistency requirements of
our swipe matching logic. While Cassandra excels at durability and storing large
amounts of data, it's not designed for the kind of atomic operations we need for
real-time match detection. Instead, use Redis to handle the atomic swipe
operations while still using Cassandra as our durable storage layer.

The key insight remains the same - we need swipes between the same users to land
on the same shard. Create keys that combine both user IDs in a consistent way.

Key:value structure:

```
Key: "swipes:123:456"
Value: {
    "123_swipe": "right",
    "456_swipe": "left"
}
```

```python
def get_key(user_a, user_b):
    # Sort IDs so (A->B) and (B->A) map to same key
    sorted_ids = sorted([user_a, user_b])
    return f"swipes:{sorted_ids[0]}:{sorted_ids[1]}"

def handle_swipe(from_user, to_user, direction):
    key = get_key(from_user, to_user)

    # Use Redis hash to store both users' swipes
    script = """
    redis.call('HSET', KEYS[1], ARGV[1], ARGV[2])
    return redis.call('HGET', KEYS[1], ARGV[3])
    """

    # Execute atomically using Lua script
    other_swipe = redis.eval(
        script,
        keys=[key],
        args=[
            f"{from_user}_swipe",  # field to set
            direction,             # our swipe
            f"{to_user}_swipe"     # field to check
        ]
    )

    # If other user swiped right too, it's a match!
    if direction == 'right' and other_swipe == 'right':
        create_match(from_user, to_user)
```

By using Redis's atomic operations via Lua scripts, we ensure that swipe
recording and match checking happen as a single operation. This gives us
consistency while maintaining low latency due to Redis's in-memory nature. The
system scales horizontally as we can add more Redis nodes, with consistent
hashing ensuring related swipes stay together.

**Challenges:**

- Managing the Redis cluster effectively - need to carefully handle node
  failures and rebalancing of the consistent hashing ring.
- Memory management - since Cassandra is our durable storage layer, we can be
  aggressive about expiring data from Redis. Periodically flush swipe data to
  Cassandra and maintain only recent swipes in Redis.
- If we lose Redis data due to a node failure, we're only losing the ability to
  detect matches for very recent swipes - users can always swipe again, and
  we're not losing the historical record in Cassandra.

This hybrid approach gives us the best of both worlds: Redis's strong
consistency and atomic operations for real-time match detection, combined with
Cassandra's durability and storage capabilities for historical data.

---

### Deep Dive 2: How can we ensure low latency for feed/stack generation?

When a user opens the app, they want to immediately start swiping. They don't
want to have to wait for us to generate a feed for them.

**The Problem:** Current design runs a slow query every time we want a new stack
of users:

```sql
SELECT * FROM users
WHERE age BETWEEN 18 AND 35
AND interestedIn = 'female'
AND lat BETWEEN userLat - maxDistance AND userLat + maxDistance
AND long BETWEEN userLong - maxDistance AND userLong + maxDistance
```

This certainly won't meet our non-functional requirement of low latency stack
generation.

---

#### Good Solution: Use of Indexed Databases for Real-Time Querying

**Approach:** Utilize indexed databases for real-time querying. By creating
indexes on the fields most commonly used in feed generation - such as user
preferences, age range, and especially geospatial data like location - we can
significantly speed up query response times. Implementing a geospatial index
allows the system to efficiently retrieve users within a specific geographic
area.

To handle the scale and performance requirements, a search-optimized database
such as **Elasticsearch** or **OpenSearch** can be employed. These databases are
designed for fast, full-text search and complex querying, making them suitable
for handling large volumes of data with minimal latency.

**Challenges:** Maintaining data consistency between the primary transactional
database and the indexed search database can be complex. Any delay or failure in
synchronizing data updates may result in users seeing outdated profiles or
missing out on new potential matches.

This can be solved via **change data capture (CDC)** mechanisms that keep the
indexed database in sync with the primary transactional database. Depending on
the rate of updates, we may want to use a batching strategy to reduce the number
of writes to the indexed database, since Elasticsearch is optimized for
read-heavy workloads, not write-heavy workloads.

---

#### Good Solution: Pre-computation and Caching

**Approach:** Pre-compute and cache user feeds asynchronously. Periodic
background jobs can generate feeds based on users' preferences and locations,
storing them in a cache for instant retrieval when the user opens the app. This
ensures that the feed is readily available without the need for real-time
computation.

By serving these cached feeds, users experience immediate access to potential
matches. The pre-computation can be scheduled during off-peak hours to reduce
the impact on system resources, and frequent updates ensure that the feeds
remain relevant.

**Challenges:**

- Highly active users may quickly exhaust their cached feeds, leading to delays
  while new matches are generated or fetched.
- Pre-computed feeds may not reflect the most recent changes in user profiles,
  preferences, or the addition of new users.
- If the user swipes through their pre-computed cached stack, we need to run the
  expensive query again to load new matches - which would be inefficient and
  slow.

---

#### Great Solution: Combination of Pre-computation and Indexed Database

**Approach:** Combine the benefits of both pre-computation and real-time
querying using an indexed database.

- Periodically pre-compute and cache feeds for users based on their preferences
  and locations.
- When a user opens the app, they receive this cached feed instantly, allowing
  for immediate interaction without any delay.
- As users swipe through and potentially exhaust their cached feed, the system
  seamlessly transitions to generating additional matches in real-time using
  Elasticsearch/indexed database.
- Can also trigger the refresh of the stack when a user has a few profiles left
  to swipe through. As far as the user is concerned, the stack seemed infinite.

By combining the two methods, we maintain low latency throughout the user's
session. The initial cached feed provides instant access, while the indexed
database ensures that even the most active users receive fresh and relevant
matches without noticeable delays.

---

#### Stale Feeds Problem

By pre-computing and caching feeds, we introduce a new issue: stale feeds.

A stale profile is defined as one that no longer fits the filter criteria for a
user. Ways a profile might become stale:

1. A user suggested in the feed might have changed locations and is no longer
   close enough to fit the feed filter criteria.
2. A user suggested in the feed might change their profile (e.g. changed
   interests) and no longer fits the feed filter criteria.

**Solution:** Have a strict TTL for cached feeds (< 1h) and re-compute the feed
via a background job on a schedule. Also consider pre-computing feeds only for
truly active users, vs. for all users. Doing upfront work for a user feed
several times a day will be expensive at scale, so we might "warm" these caches
only for users we know will eventually use the cached profiles.

**Tunable parameters:** TTL for cached profiles, number of profiles cached, set
of users we are caching feeds for.

> **Key Insight:** When designing a system, it's very useful if the system has
> parameters that can be tuned without changing the overall logic of the system.
> These parameters can be modified to find an efficient configuration for the
> scale / use-case of the system and can be adjusted over time. This gives the
> operators of the system strong control over the health of the system without
> having to rework the system itself.

**User-triggered stale feed actions:**

1. The user being served the feed changes their filter criteria, resulting in
   profiles in the cached feed becoming stale.
2. The user being served the feed changes their location significantly (e.g.
   they go to a different neighborhood or city), resulting in profiles in the
   cached feed becoming stale.

All of the above are interactions that could trigger a feed refresh in the
background, so that the feed is ready for the user if they choose to start
swiping shortly after.

---

### Deep Dive 3: How can the system avoid showing user profiles that the user has previously swiped on?

It would be a pretty poor experience if users were re-shown profiles they had
swiped on. It could give the user the impression that their "yes" swipes were
not recorded, or it could annoy users to see people they previously said "no" to
as suggestions again. We should design a solution to prevent this bad user
experience.

---

#### Bad Solution: DB Query + Contains Check

**Approach:** Have our feed builder service query the swipe database and do a
contains check to filter out users who have been swiped on before. The query to
get all the swiped-on profiles will be efficient because it will be routed to
the appropriate partition based on `swiping_user_id`.

**Challenges:**

1. If we're dealing with a system that prioritizes availability over
   consistency, not all swipe data might have "landed" in all replicas of a
   partition by the time a feed is being generated. This means we might risk
   missing swipes, and are at risk of re-showing profiles.
2. If a user has an extensive swipe history, there might be a lot of user IDs
   returned, and the contains check will get progressively more expensive.

---

#### Great Solution: Cache + DB Query + Contains Check

**Approach:** Build off the previous approach by adding a **client-side cache**
that houses recent user swipes to avoid the problems presented with an
availability-skewing system. We wouldn't manage this cache on the backend - we'd
manage it **client-side**.

Managing a cache on the backend merely to store data before it "lands" on all
partitions in a NoSQL system would be expensive. We can take advantage of the
fact that the client is part of the system and have the client store recent
swipe data (perhaps the K most recent swipes). This allows the client to filter
out profiles that might be suggested in a feed that have already been swiped on
recently.

This cache is doubly useful when a user is close to depleting their initial
stack. Imagine a user swiping through 200 pre-fetched profiles. When the user
gets to profile ~150, the client can:

1. Ping the backend to generate a new feed for the user.
2. Request that feed once the backend is done generating the feed.
3. Filter out any profiles that the user eventually swipes on.

The client works as a part of this system because we can make the assumption
that the user is only using this app on one device. Therefore, we can leverage
the client as a place to manage and store data.

**Challenges:** Still subjected to the problems created by users with extensive
swipe histories and large user ID contains checks that get slower as the user
swipes more.

---

#### Great Solution: Cache + Contains Check + Bloom Filter

**Approach:** This approach skews somewhat "over-engineered", but is a legit use
case for a bloom filter to support feed building for users with large swipe
histories.

Build on top of the previous approach. For users with large swipe histories,
store a **bloom filter**. If a user exceeds a swipe history of a certain size (a
size that would make storage in a cache unwieldy or "contains" checks slow
during a query), we can build and cache a bloom filter for that user and use it
in the filtering process.

**How Bloom Filters work here:**

- A bloom filter would sometimes yield **false positives** for swipes (sometimes
  assume a user swiped on a profile that they didn't). However, the bloom filter
  would **never generate false negatives** (never say a user hadn't swiped on a
  profile they actually did).
- This means we'd successfully avoid re-showing profiles, but there might be a
  small number of profiles that we might never show the user due to false
  positives.
- Bloom filters have **tunable error percentages** that are usually tied to how
  much space they take up, so this can be tuned to promote low false positives,
  reasonable space consumption, and fast filtering.

**Challenges:** Managing the bloom filter cache. It will need to be updated and
also recovered if the cache goes down. A bloom filter is easy to re-create with
the swipe data, but this would be expensive at scale in the event of a node
outage.

---

## Final Design

Architecture components in the final design:

- **Client** (Mobile App)
- **API Gateway**
- **Profile Service** -> Profile DB
- **Swipe Service** -> Redis (atomic ops) + Cassandra (durable storage)
- **Feed Service** -> Redis Cache + Elasticsearch (indexed DB)
- **Push Notification Service** (APNS/FCM)
- **Bloom Filter** for deduplication of previously-swiped profiles

See `screenshots/full-expanded.png` for the full architecture diagram.

---

## What is Expected at Each Level

### Mid-Level

- **Breadth vs. Depth:** Mostly focused on breadth (80% vs 20%). Should be able
  to craft a high-level design that meets the functional requirements, but many
  components will be abstractions with surface-level familiarity.
- **Probing the Basics:** Interviewer will spend some time probing the basics to
  confirm that you know what each component in your system does. For example, if
  you add an API Gateway, expect that they may ask you what it does and how it
  works (at a high level). The interviewer is not taking anything for granted
  with respect to your knowledge.
- **Mixture of Driving and Taking the Backseat:** You should drive the early
  stages but the interviewer will take over and drive the later stages while
  probing your design.
- **The Bar for Tinder:** An E4 candidate will have clearly defined the API
  endpoints and data model, landed on a high-level design that is functional for
  all of feed creation, swiping, and matching. Don't expect in-depth knowledge
  about specific technologies, but do expect design solutions that support
  traditional filters and geo-spatial filters, and a solution to avoid
  re-showing swiped-on profiles.

### Senior

- **Depth of Expertise:** About 60% breadth and 40% depth. Should go into
  technical details in areas where you have hands-on experience. Demonstrate
  deep understanding of key concepts and technologies.
- **Advanced System Design:** Familiar with advanced system design principles
  (different technologies, their use-cases, how they fit together).
- **Articulating Architectural Decisions:** Clearly articulate pros and cons of
  different architectural choices, especially how they impact scalability,
  performance, and maintainability.
- **Problem-Solving and Proactivity:** Demonstrate strong problem-solving skills
  and a proactive approach. Anticipate potential challenges and suggest
  improvements.
- **The Bar for Tinder:** E5 candidates expected to quickly go through the
  initial high-level design so that they can spend time discussing, in detail,
  how to handle efficient / scalable feed generation and management and how to
  ensure successful match creation. Be proactive in calling out different
  trade-offs for feed building and have some knowledge of the type of index that
  could be used to successfully power the feed. Also be aware of when feed
  caches might become "stale".

### Staff+

- **Emphasis on Depth:** About 40% breadth and 60% depth in understanding.
  Demonstrate that you have solved enough problems in the real world to
  confidently design a solution backed by your experience.
- **Know technologies in practice**, not just in theory but in practice. Draw
  from past experiences to explain how they'd be applied. The interviewer knows
  you know the small stuff (REST API, data normalization, etc.) so breeze
  through that at a high level to have time for what is interesting.
- **High Degree of Proactivity:** Identify and solve issues independently.
  Recognize and address core challenges. Not just responding to problems but
  anticipating them and implementing preemptive solutions. Your interviewer
  should intervene only to focus, not to steer.
- **Practical Application of Technology:** Well-versed in the practical
  application of various technologies. Experience guides the conversation with
  clear understanding of how different tools and systems can be configured in
  real-world scenarios.
- **Complex Problem-Solving and Decision-Making:** Tackle complex technical
  challenges while making informed decisions considering scalability,
  performance, reliability, and maintenance.
- **Advanced System Design and Scalability:** Focus on scalability and
  reliability, especially under high load conditions. Thorough understanding of
  distributed systems, load balancing, caching strategies, and other advanced
  concepts.
- **The Bar for Tinder:** Expectations are high regarding depth and quality of
  solutions. Exceptional candidates delve deeply into each topic and may even
  steer the conversation in a different direction. Expected to possess a solid
  understanding of the trade-offs between various solutions and articulate them
  clearly, treating the interviewer as a peer.

---

## Key Takeaways & Interview Tips

1. **Start simple, optimize later** - Begin with basic architecture, then layer
   on complexity through deep dives.
2. **Separate services by access pattern** - Profile reads vs. swipe writes have
   very different characteristics.
3. **Cassandra for write-heavy workloads** - Good partition key design is
   critical (user_pair pattern for co-locating related swipes).
4. **Redis for atomic operations** - Lua scripts provide atomicity for real-time
   match detection, Cassandra for durable storage.
5. **Bloom filters for set membership** - Space-efficient way to check "already
   swiped" with acceptable false positive rate and tunable error percentages.
6. **Pre-computation + indexed DB for latency** - Cached feeds for instant
   access, Elasticsearch fallback for real-time generation.
7. **Discuss trade-offs** - Consistency vs. availability, accuracy vs.
   performance, backend vs. client-side caching.
8. **Consider stale data** - When caching, think about TTL, cache invalidation
   triggers, and tunable parameters.
9. **Push notifications for async events** - APNS/FCM for notifying users who
   aren't actively using the app.
10. **Client as part of the system** - Leverage client-side caching for recent
    swipe deduplication.
