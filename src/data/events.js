// ─── Single source of truth for all demo events ───
export const EVENTS = [
  {
    id: "1",
    title: "Token2049 Side Event — Web3 Growth Summit",
    description: "The premier side event of Token2049 Singapore, bringing together 5,000+ founders, investors, and protocol teams. Previous sponsors include Binance, OKX, and Animoca Brands.",
    date: "Sep 18, 2026",
    start_time: "2026-09-18T09:00:00Z",
    end_time: "2026-09-19T18:00:00Z",
    location: { name: "Marina Bay Sands, Singapore", address: "10 Bayfront Ave, Singapore 018956" },
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80",
    category: "Crypto",
    audience: "5,000+",
    tags: ["token2049","singapore","crypto","asia","conference","defi"],
    score: 97,
    organizer_id: "org1",
    status: "published",
    sponsorship_plans: [
      { id: "101", title: "Presenting Sponsor", price: 1, description: "Premier logo placement, main stage speaking slot, VIP table for 10.", benefits: ["Main stage keynote (30 min)","Logo on all materials","VIP table x10","Social media campaign","Dedicated email blast"] },
      { id: "102", title: "Gold Sponsor", price: 1, description: "High-visibility branding across all event touchpoints.", benefits: ["Panel speaking slot (15 min)","Booth space (6x3m)","Logo on stage backdrop","5 VIP passes","Social media mentions"] },
      { id: "103", title: "Silver Sponsor", price: 1, description: "Strong brand presence with networking access.", benefits: ["Logo on event website","2 VIP passes","Networking dinner access","Social media shoutout"] },
    ],
  },
  {
    id: "2",
    title: "OKX Builder Summit 2026",
    description: "OKX's flagship developer conference on X Layer, gathering 1,200+ builders, protocol engineers, and DeFi founders. Exclusive focus on the X Layer ecosystem and AI-native dApps.",
    date: "Jun 20, 2026",
    start_time: "2026-06-20T09:00:00Z",
    end_time: "2026-06-21T18:00:00Z",
    location: { name: "Suntec Convention Centre, Singapore", address: "1 Raffles Blvd, Singapore 039593" },
    image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&q=80",
    category: "X Layer",
    audience: "1,200+",
    tags: ["okx","xlayer","builder","singapore","web3","asia","developer"],
    score: 99,
    organizer_id: "org1",
    status: "published",
    sponsorship_plans: [
      { id: "201", title: "Diamond Sponsor", price: 1, description: "Ultimate brand exposure at OKX's premier builder event.", benefits: ["Co-branding with OKX","Keynote slot (20 min)","Exclusive workshop room","10 passes","Featured in OKX comms"] },
      { id: "202", title: "Gold Sponsor", price: 1, description: "Premium visibility for builder-focused audiences.", benefits: ["Demo booth","Lightning talk (5 min)","6 passes","Logo on all materials"] },
      { id: "203", title: "Community Sponsor", price: 1, description: "Support the X Layer builder community.", benefits: ["Logo on website","3 passes","Social media mention"] },
    ],
  },
  {
    id: "3",
    title: "ETHGlobal Bangkok — Side Event",
    description: "Satellite event during ETHGlobal Bangkok week, targeting 3,000+ Ethereum developers and DeFi researchers. Focused on cross-chain infrastructure and ZK applications.",
    date: "May 12, 2026",
    start_time: "2026-05-12T10:00:00Z",
    end_time: "2026-05-12T22:00:00Z",
    location: { name: "True Digital Park, Bangkok", address: "101 True Digital Park, Sukhumvit Rd, Bangkok 10250" },
    image: "https://images.unsplash.com/photo-1560439514-4e9645039924?w=800&q=80",
    category: "DeFi",
    audience: "3,000+",
    tags: ["ethglobal","bangkok","defi","ethereum","asia","zk","side event","thailand"],
    score: 94,
    organizer_id: "org2",
    status: "published",
    sponsorship_plans: [
      { id: "301", title: "Headline Sponsor", price: 1, description: "Top-of-page branding for the most-watched Ethereum event in Southeast Asia.", benefits: ["Opening remarks slot","Sponsored hackathon track","Large booth","8 passes","Logo everywhere"] },
      { id: "302", title: "Track Sponsor", price: 1, description: "Own a thematic track at the event.", benefits: ["Named track (e.g. OKX DeFi Track)","3 speakers from your team","4 passes","Logo on track materials"] },
      { id: "303", title: "Supporter", price: 1, description: "Brand awareness among Ethereum developers.", benefits: ["Logo on website & app","2 passes","Tweet from organizer"] },
    ],
  },
  {
    id: "4",
    title: "AI × Crypto Summit — Singapore",
    description: "The leading conference at the intersection of artificial intelligence and blockchain. 2,000+ researchers, founders, and investors exploring AI agents, onchain inference, and the future of autonomous finance.",
    date: "Aug 7, 2026",
    start_time: "2026-08-07T09:00:00Z",
    end_time: "2026-08-08T18:00:00Z",
    location: { name: "Capella Singapore, Sentosa", address: "1 The Knolls, Sentosa Island, Singapore 098297" },
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
    category: "AI & Crypto",
    audience: "2,000+",
    tags: ["ai","crypto","singapore","agents","llm","onchain","inference","asia","summit"],
    score: 95,
    organizer_id: "org1",
    status: "published",
    sponsorship_plans: [
      { id: "401", title: "Presenting Sponsor", price: 1, description: "Lead sponsor of the flagship AI × Crypto track.", benefits: ["Keynote slot (25 min)","Co-branding rights","10 passes","Investor dinner access","Featured in all comms"] },
      { id: "402", title: "Gold Sponsor", price: 1, description: "Strong visibility among AI and crypto founders.", benefits: ["Demo booth","Panel slot (15 min)","6 passes","Social media campaign"] },
      { id: "403", title: "Community Sponsor", price: 1, description: "Support the AI × Crypto builder community.", benefits: ["Logo on website","2 passes","Social shoutout"] },
    ],
  },
  {
    id: "5",
    title: "X Layer Ecosystem Day — Hong Kong",
    description: "OKX's first dedicated X Layer ecosystem event in Hong Kong, showcasing dApps, protocols, and builders. Targeting institutional investors and Web3 founders.",
    date: "Apr 8, 2026",
    start_time: "2026-04-08T10:00:00Z",
    end_time: "2026-04-08T20:00:00Z",
    location: { name: "Four Seasons Hong Kong", address: "8 Finance St, Central, Hong Kong" },
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80",
    category: "X Layer",
    audience: "800+",
    tags: ["xlayer","okx","hongkong","ecosystem","hk","asia","institutional","april"],
    score: 92,
    organizer_id: "org1",
    status: "published",
    sponsorship_plans: [
      { id: "501", title: "Ecosystem Partner", price: 1, description: "Co-present with OKX at the flagship X Layer event in HK.", benefits: ["Co-branding rights","Product demo slot (10 min)","6 passes","Investor dinner access"] },
      { id: "502", title: "Supporting Sponsor", price: 1, description: "Visibility at Hong Kong's top X Layer event.", benefits: ["Booth space","3 passes","Logo on stage"] },
    ],
  },
  {
    id: "6",
    title: "Pragma Bangkok — DeFi Research Summit",
    description: "The academic side event of Ethereum Bangkok week. 600+ researchers, protocol designers, and MEV specialists presenting cutting-edge DeFi research.",
    date: "Mar 28, 2026",
    start_time: "2026-03-28T09:00:00Z",
    end_time: "2026-03-28T18:00:00Z",
    location: { name: "Centara Grand, Bangkok", address: "999/99 Rama 1 Rd, Pathumwan, Bangkok 10330" },
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80",
    category: "DeFi",
    audience: "600+",
    tags: ["pragma","bangkok","defi","research","mev","asia","march","thailand","ethereum"],
    score: 88,
    organizer_id: "org2",
    status: "published",
    sponsorship_plans: [
      { id: "601", title: "Research Partner", price: 1, description: "Align your brand with cutting-edge DeFi research.", benefits: ["Research paper sponsorship","Panel slot","4 passes","Logo on proceedings"] },
      { id: "602", title: "Bronze Sponsor", price: 1, description: "Support the DeFi research community.", benefits: ["Logo on website","2 passes","Mention in opening"] },
    ],
  },
];

export const getEventById = (id) => EVENTS.find((e) => e.id === id) || null;

export const searchEvents = (query = "") => {
  if (!query.trim()) return EVENTS;
  const words = query.toLowerCase().split(/\s+/);
  return EVENTS.filter((e) =>
    words.some((w) =>
      e.title.toLowerCase().includes(w) ||
      e.tags.some((t) => t.includes(w)) ||
      e.location.name.toLowerCase().includes(w) ||
      e.category.toLowerCase().includes(w)
    )
  );
};

export const scoreEvents = (query = "") => {
  const words = query.toLowerCase().split(/\s+/);
  return EVENTS.map((e) => {
    let score = e.score;
    words.forEach((w) => {
      if (e.tags.some((t) => t.includes(w))) score += 3;
      if (e.title.toLowerCase().includes(w)) score += 2;
      if (e.location.name.toLowerCase().includes(w)) score += 2;
      if (e.category.toLowerCase().includes(w)) score += 1;
    });
    return { ...e, score: Math.min(score, 99) };
  }).sort((a, b) => b.score - a.score);
};
