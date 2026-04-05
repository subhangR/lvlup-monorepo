#!/bin/bash

HLD_PARENT="task_1774173804971_bj1d0h6s6"
LLD_PARENT="task_1774173818002_cdo61vt9h"
BEH_PARENT="task_1774173821457_nhrkuzsp0"

SD_BASE="https://www.hellointerview.com/learn/system-design/problem-breakdowns"
LLD_BASE="https://www.hellointerview.com/learn/system-design/in-a-hurry"
BEH_BASE="https://www.hellointerview.com/learn/behavioral"

create_sd_task() {
  local parent="$1" name="$2" slug="$3" access="$4"
  local url="${SD_BASE}/${slug}"
  local title="Diagrams: ${name}"
  if [ "$access" = "PREMIUM" ]; then
    title="Diagrams: ${name} [PREMIUM]"
  fi

  local desc="Extract diagrams from the ${name} question page.

- **Slug:** \`${slug}\`
- **URL:** ${url}
- **Access:** ${access}

## How to extract:
1. Ensure Chrome debug session running on CDP port 9222 (logged in as Shaik Manzil)
2. Run: \`cd hello-interview-extract && node extract-diagrams.js ${slug} \"${url}\"\`
3. Script finds all \`div.MuiBox-root[style*=\"cursor:pointer\"]\` diagram wrappers, takes clipped PNG screenshots, downloads original Excalidraw SVGs from \`<object data=\"...\">\` URLs, saves manifest.json

## Output:
\`\`\`
hello-interview-extract/questions/${slug}/diagrams/
  diagram-NN.png, diagram-NN.svg, ..., manifest.json
\`\`\`"

  maestro task create --parent "$parent" --title "$title" --priority medium --description "$desc" 2>&1 | tail -1
}

create_lld_task() {
  local parent="$1" name="$2" slug="$3" url="$4" access="$5"
  local title="Diagrams: ${name}"
  if [ "$access" = "PREMIUM" ]; then
    title="Diagrams: ${name} [PREMIUM]"
  fi

  local desc="Extract diagrams from the LLD ${name} page.

- **Slug:** \`${slug}\`
- **URL:** ${url}
- **Access:** ${access}

## How to extract:
1. Ensure Chrome debug session running on CDP port 9222
2. Run: \`cd hello-interview-extract && node extract-diagrams.js lld-${slug} \"${url}\"\`
3. Script finds diagram wrappers, takes clipped PNGs, downloads Excalidraw SVGs, saves manifest.json

## Output:
\`\`\`
hello-interview-extract/questions/lld-${slug}/diagrams/
  diagram-NN.png, diagram-NN.svg, ..., manifest.json
\`\`\`"

  maestro task create --parent "$parent" --title "$title" --priority medium --description "$desc" 2>&1 | tail -1
}

create_beh_task() {
  local parent="$1" name="$2" slug="$3" url="$4" access="$5"
  local title="Diagrams: ${name}"
  if [ "$access" = "PREMIUM" ]; then
    title="Diagrams: ${name} [PREMIUM]"
  fi

  local desc="Extract diagrams (if any) from the Behavioral ${name} page.

- **Slug:** \`${slug}\`
- **URL:** ${url}
- **Access:** ${access}

Note: Behavioral pages may have few or no diagrams. Script handles 0 diagrams gracefully.

## How to extract:
1. Ensure Chrome debug session running on CDP port 9222
2. Run: \`cd hello-interview-extract && node extract-diagrams.js behavioral-${slug} \"${url}\"\`

## Output:
\`\`\`
hello-interview-extract/questions/behavioral-${slug}/diagrams/
  diagram-NN.png, diagram-NN.svg, ..., manifest.json
\`\`\`"

  maestro task create --parent "$parent" --title "$title" --priority medium --description "$desc" 2>&1 | tail -1
}

echo "=== Creating HLD diagram subtasks (28) ==="

# Free (16)
create_sd_task "$HLD_PARENT" "Bit.ly (URL Shortener)" "bitly" "Free"
create_sd_task "$HLD_PARENT" "Dropbox (File Storage)" "dropbox" "Free"
create_sd_task "$HLD_PARENT" "Local Delivery Service (GoPuff)" "gopuff" "Free"
create_sd_task "$HLD_PARENT" "Ticketmaster (Event Ticketing)" "ticketmaster" "Free"
create_sd_task "$HLD_PARENT" "FB News Feed" "fb-news-feed" "Free"
create_sd_task "$HLD_PARENT" "Tinder (Dating App)" "tinder" "Free"
create_sd_task "$HLD_PARENT" "LeetCode (Online Judge)" "leetcode" "Free"
create_sd_task "$HLD_PARENT" "WhatsApp (Messaging)" "whatsapp" "Free"
create_sd_task "$HLD_PARENT" "Rate Limiter (Distributed)" "distributed-rate-limiter" "Free"
create_sd_task "$HLD_PARENT" "FB Live Comments" "fb-live-comments" "Free"
create_sd_task "$HLD_PARENT" "FB Post Search" "fb-post-search" "Free"
create_sd_task "$HLD_PARENT" "YouTube Top K" "top-k" "Free"
create_sd_task "$HLD_PARENT" "Uber (Ride Sharing)" "uber" "Free"
create_sd_task "$HLD_PARENT" "YouTube (Video Streaming)" "youtube" "Free"
create_sd_task "$HLD_PARENT" "Web Crawler" "web-crawler" "Free"
create_sd_task "$HLD_PARENT" "Ad Click Aggregator" "ad-click-aggregator" "Free"

# Premium (12)
create_sd_task "$HLD_PARENT" "News Aggregator (Google News)" "google-news" "PREMIUM"
create_sd_task "$HLD_PARENT" "Yelp (Local Business)" "yelp" "PREMIUM"
create_sd_task "$HLD_PARENT" "Strava (Fitness Tracking)" "strava" "PREMIUM"
create_sd_task "$HLD_PARENT" "Online Auction" "online-auction" "PREMIUM"
create_sd_task "$HLD_PARENT" "Price Tracking (CamelCamelCamel)" "camelcamelcamel" "PREMIUM"
create_sd_task "$HLD_PARENT" "Instagram (Photo Sharing)" "instagram" "PREMIUM"
create_sd_task "$HLD_PARENT" "Robinhood (Stock Trading)" "robinhood" "PREMIUM"
create_sd_task "$HLD_PARENT" "Google Docs (Collaborative Editing)" "google-docs" "PREMIUM"
create_sd_task "$HLD_PARENT" "Distributed Cache" "distributed-cache" "PREMIUM"
create_sd_task "$HLD_PARENT" "Job Scheduler" "job-scheduler" "PREMIUM"
create_sd_task "$HLD_PARENT" "Payment System" "payment-system" "PREMIUM"
create_sd_task "$HLD_PARENT" "Metrics Monitoring" "metrics-monitoring" "PREMIUM"

echo ""
echo "=== Creating LLD diagram subtasks (17) ==="

LLD_PB="${LLD_BASE}/../problem-breakdowns"
LLD_CORE="https://www.hellointerview.com/learn/code-design/in-a-hurry"
LLD_CONC="https://www.hellointerview.com/learn/code-design/deep-dives"

# LLD Problem Breakdowns (8)
create_lld_task "$LLD_PARENT" "Connect Four" "connect-four" "https://www.hellointerview.com/learn/code-design/problem-breakdowns/connect-four" "Free"
create_lld_task "$LLD_PARENT" "Amazon Locker" "amazon-locker" "https://www.hellointerview.com/learn/code-design/problem-breakdowns/amazon-locker" "Free"
create_lld_task "$LLD_PARENT" "Elevator" "elevator" "https://www.hellointerview.com/learn/code-design/problem-breakdowns/elevator" "Free"
create_lld_task "$LLD_PARENT" "Parking Lot" "parking-lot" "https://www.hellointerview.com/learn/code-design/problem-breakdowns/parking-lot" "PREMIUM"
create_lld_task "$LLD_PARENT" "File System" "file-system" "https://www.hellointerview.com/learn/code-design/problem-breakdowns/file-system" "PREMIUM"
create_lld_task "$LLD_PARENT" "Movie Ticket Booking (BookMyShow)" "movie-ticket-booking" "https://www.hellointerview.com/learn/code-design/problem-breakdowns/movie-ticket-booking" "PREMIUM"
create_lld_task "$LLD_PARENT" "Rate Limiter" "rate-limiter" "https://www.hellointerview.com/learn/code-design/problem-breakdowns/rate-limiter" "PREMIUM"
create_lld_task "$LLD_PARENT" "Inventory Management" "inventory-management" "https://www.hellointerview.com/learn/code-design/problem-breakdowns/inventory-management" "PREMIUM"

# LLD Core Content (5)
create_lld_task "$LLD_PARENT" "Introduction" "introduction" "https://www.hellointerview.com/learn/code-design/in-a-hurry/introduction" "Free"
create_lld_task "$LLD_PARENT" "Delivery Framework" "delivery" "https://www.hellointerview.com/learn/code-design/in-a-hurry/delivery" "Free"
create_lld_task "$LLD_PARENT" "Design Principles" "design-principles" "https://www.hellointerview.com/learn/code-design/in-a-hurry/design-principles" "Free"
create_lld_task "$LLD_PARENT" "OOP Concepts" "oop" "https://www.hellointerview.com/learn/code-design/in-a-hurry/oop" "Free"
create_lld_task "$LLD_PARENT" "Design Patterns" "design-patterns" "https://www.hellointerview.com/learn/code-design/in-a-hurry/design-patterns" "Free"

# LLD Concurrency (4)
create_lld_task "$LLD_PARENT" "Concurrency Introduction" "concurrency-intro" "https://www.hellointerview.com/learn/code-design/deep-dives/concurrency" "Free"
create_lld_task "$LLD_PARENT" "Concurrency - Correctness" "concurrency-correctness" "https://www.hellointerview.com/learn/code-design/deep-dives/correctness" "PREMIUM"
create_lld_task "$LLD_PARENT" "Concurrency - Coordination" "concurrency-coordination" "https://www.hellointerview.com/learn/code-design/deep-dives/coordination" "PREMIUM"
create_lld_task "$LLD_PARENT" "Concurrency - Scarcity" "concurrency-scarcity" "https://www.hellointerview.com/learn/code-design/deep-dives/scarcity" "PREMIUM"

echo ""
echo "=== Creating Behavioral diagram subtasks (9) ==="

create_beh_task "$BEH_PARENT" "Why the Behavioral Matters" "why-behavioral" "https://www.hellointerview.com/learn/behavioral/in-a-hurry/why-behavioral" "Free"
create_beh_task "$BEH_PARENT" "Decode - How Interviews Work" "decode" "https://www.hellointerview.com/learn/behavioral/in-a-hurry/decode" "PREMIUM"
create_beh_task "$BEH_PARENT" "Select - Choosing Responses" "select" "https://www.hellointerview.com/learn/behavioral/in-a-hurry/select" "PREMIUM"
create_beh_task "$BEH_PARENT" "Deliver - Telling a Good Story" "deliver" "https://www.hellointerview.com/learn/behavioral/in-a-hurry/deliver" "PREMIUM"
create_beh_task "$BEH_PARENT" "The Big Three Questions" "big-three" "https://www.hellointerview.com/learn/behavioral/in-a-hurry/big-three" "PREMIUM"
create_beh_task "$BEH_PARENT" "Adapting to Big Tech" "adapting" "https://www.hellointerview.com/learn/behavioral/in-a-hurry/adapting" "PREMIUM"
create_beh_task "$BEH_PARENT" "Practicing" "practicing" "https://www.hellointerview.com/learn/behavioral/in-a-hurry/practicing" "PREMIUM"
create_beh_task "$BEH_PARENT" "Common Pitfalls" "pitfalls" "https://www.hellointerview.com/learn/behavioral/in-a-hurry/pitfalls" "PREMIUM"
create_beh_task "$BEH_PARENT" "Special Interview Types" "special-types" "https://www.hellointerview.com/learn/behavioral/in-a-hurry/special-types" "PREMIUM"

echo ""
echo "=== ALL DONE ==="
