"""
ANVESHA 2.0 — SERVER-SIDE NEWS SERVICE (GOOGLE RSS, GNEWS & NEWSDATA.IO)
========================================================================
Fetches real-time, authentic news articles related to specific crime categories
and geographic units in Tamil Nadu using targeted search queries, independent provider
execution, local relevance scoring, and regional fallback.
Strictly server-side; API keys are never exposed to frontend client.
"""

import os
import time
import urllib.parse
import urllib.request
import json
import logging
import re
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor
from typing import Dict, Any, List, Optional, Tuple

logger = logging.getLogger(__name__)

CATEGORY_SYNONYMS = {
    "THEFT": ["theft", "stolen", "vehicle theft", "burglary", "property", "robbery"],
    "BURGLARY": ["burglary", "house break-in", "theft", "break-in", "robbery"],
    "ROBBERY": ["robbery", "armed robbery", "heist", "extortion", "dacoity"],
    "PROPERTY": ["property theft", "theft", "burglary", "robbery", "recovery"],
    "VIOLENT": ["violent crime", "assault", "homicide", "murder", "law and order", "attack"],
    "ECONOMIC": ["financial fraud", "economic offenses", "cheating", "scam", "forgery"],
    "CYBER": ["cyber crime", "online fraud", "phishing", "digital scam", "cyber"],
    "WOMEN_AND_CHILDREN": ["women safety", "protection", "pocso", "crimes against women", "harassment"],
    "ALL_CRIME": ["crime", "police patrol", "law and order", "arrests", "court"]
}

DISTRICT_ALIASES = {
    "CHENNAI": ["chennai", "madras", "tambaram", "avadi", "vepery", "mylapore", "anna nagar", "t nagar", "adyar", "triplicane", "guindy", "royapettah"],
    "COIMBATORE": ["coimbatore", "kovai", "pollachi", "mettupalayam", "singanallur", "sulur", "thudiyalur"],
    "MADURAI": ["madurai", "usilampatti", "melur", "thirumangalam", "vadipatti"],
    "KANCHIPURAM": ["kanchipuram", "kancheepuram", "walajabad", "sriperumbudur", "kundrathur"],
    "TIRUPPUR": ["tiruppur", "tirupur", "dharapuram", "kangeyam", "palladam", "udumalaipettai", "avanshi"],
    "ERODE": ["erode", "bhavani", "perundurai", "gobichettipalayam", "sathyamangalam"],
    "SALEM": ["salem", "attur", "mettur", "omalur", "edappadi", "sankari"],
    "TIRUCHIRAPPALLI": ["tiruchirappalli", "trichy", "thiruverumbur", "manapparai", "musiri", "lalgudi"],
    "TIRUNELVELI": ["tirunelveli", "nellai", "palayamkottai", "ambasamudram", "cheranmahadevi"],
    "DINDIGUL": ["dindigul", "palani", "kodaikanal", "oddanchatram", "natham"],
    "THANJAVUR": ["thanjavur", "tanjore", "kumbakonam", "pattukkottai", "orathanadu"],
    "VELLORE": ["vellore", "katpadi", "gudiyattam", "anaicut"],
    "CUDDALORE": ["cuddalore", "chidambaram", "panruti", "vridhachalam", "neyveli"],
    "VILLUPURAM": ["villupuram", "viluppuram", "tindivanam", "gingee", "vanur"],
    "DHARMAPURI": ["dharmapuri", "harur", "palacode", "pennagaram", "karimangalam"],
    "KRISHNAGIRI": ["krishnagiri", "hosur", "pochampalli", "denkanikottai", "bargur"],
    "THIRUVALLUR": ["thiruvallur", "tiruvallur", "ponneri", "gummidipoondi", "tiruttani"],
    "PUDUCHERRY": ["puducherry", "pondicherry", "ouzhukarai", "villianur", "bahour"],
    "KARAIKAL": ["karaikal", "thirunallar", "neravy", "kottucherry"],
    "NILGIRIS": ["nilgiris", "ooty", "udhagamandalam", "coonoor", "gudalur", "kotagiri"],
    "KANYAKUMARI": ["kanyakumari", "nagercoil", "thuckalay", "colachel", "kuzhithurai"],
    "THOOTHUGUDI": ["thoothugudi", "tuticorin", "kovilpatti", "tiruchendur", "srivaikuntam"],
    "RAMANATHAPURAM": ["ramanathapuram", "ramnad", "rameswaram", "paramakudi"],
    "SIVAGANGAI": ["sivagangai", "sivaganga", "karaikudi", "devakottai", "manamadurai"],
    "VIRUDHUNAGAR": ["virudhunagar", "sivakasi", "rajapalayam", "aruppukkottai", "srivilliputhur"],
    "THENI": ["theni", "bodinayakanur", "periyakulam", "cumbum", "uthamapalayam"],
    "NAGAPATTINAM": ["nagapattinam", "velankanni", "kilvelur", "vedaranyam"],
    "THIRUVARUR": ["thiruvarur", "tiruvarur", "mannargudi", "nannilam", "kodavasal"],
    "PUDUKKOTTAI": ["pudukkottai", "pudukottai", "aranthangi", "illuppur"],
    "ARIYALUR": ["ariyalur", "jayankondam", "sendurai"],
    "PERAMBALUR": ["perambalur", "veppanthattai", "kunnam"],
    "KARUR": ["karur", "kulithalai", "aravakurichi"],
    "NAMAKKAL": ["namakkal", "tiruchengode", "rasipuram", "paramathi velur"],
    "TIRUVANNAMALAI": ["tiruvannamalai", "thiruvannamalai", "arani", "cheyyar", "polur"],
    "RANIPET": ["ranipet", "arcot", "walaja", "arakonam", "arakkonam"],
    "TIRUPATHUR": ["tirupathur", "ambur", "vaniyambadi", "natrampalli"],
    "CHENGALPATTU": ["chengalpattu", "chengalpet", "tambaram", "pallavaram", "maraimalainagar", "maduranthakam"],
    "TENKASI": ["tenkasi", "sankarankovil", "kadayanallur", "senkottai"],
    "KALLAKURICHI": ["kallakurichi", "sankarapuram", "chinnasalem", "ulundurpet"],
    "MAYILADUTHURAI": ["mayiladuthurai", "sirkazhi", "tarangambadi", "kuthalam"]
}

STAGE_KEYWORDS = {
    "Confirmed Outcome": ["convict", "sentenced", "chargesheet", "police busted", "gang busted", "cracked", "seized", "recovered", "property recovered", "cash recovered"],
    "Investigation": ["arrested", "held", "nabbed", "detained", "investigat", "probe", "police inquiry", "remanded", "special team", "searches", "custody", "manhunt", "hunt on"],
    "Official Advisory": ["advisory", "warning", "police alert", "urged", "public advisory", "press note", "police chief", "dgp", "commissioner urged", "sp said"],
    "Allegation / FIR": ["alleged", "accused", "complaint", "booked", "fir registered", "suspect", "claims", "unidentified", "reported missing", "decamped with", "looted"]
}

CATEGORY_FALLBACK_IMAGES = {
    "THEFT": "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80",
    "BURGLARY": "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80",
    "ROBBERY": "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80",
    "PROPERTY": "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80",
    "VIOLENT": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80",
    "ECONOMIC": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
    "CYBER": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80",
    "WOMEN_AND_CHILDREN": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
    "ALL_CRIME": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80"
}


def decode_google_news_url(google_url: str) -> Optional[str]:
    """Decodes Google News RSS redirect URLs to the original publisher newspaper article URL."""
    try:
        if "/articles/" not in google_url:
            return None
        art_id = google_url.split("/articles/")[1].split("?")[0]
        params_url = f"https://news.google.com/rss/articles/{art_id}?hl=en-IN&gl=IN&ceid=IN:en"
        req = urllib.request.Request(
            params_url,
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
        )
        with urllib.request.urlopen(req, timeout=3.5) as resp:
            html = resp.read().decode("utf-8", errors="ignore")

        sg_m = re.search(r'data-n-a-sg="([^"]+)"', html)
        ts_m = re.search(r'data-n-a-ts="([^"]+)"', html)
        if not (sg_m and ts_m):
            return None
        sg, ts = sg_m.group(1), ts_m.group(1)

        ctx = [
            ["X", "X", ["X", "X"], None, None, 1, 1, "IN:en", None, 1, None, None, None, None, None, 0, 1],
            "X", "X", 1, [1, 1, 1], 1, 1, None, 0, 0, None, 0
        ]
        inner = ["garturlreq", ctx, art_id, int(ts) if ts.isdigit() else ts, sg]
        envelopes = [["Fbv4je", json.dumps(inner, separators=(",", ":")), None, "0"]]
        encoded_env = urllib.parse.quote(json.dumps([envelopes], separators=(",", ":")))
        body = f"f.req={encoded_env}"

        post_req = urllib.request.Request(
            "https://news.google.com/_/DotsSplashUi/data/batchexecute",
            data=body.encode("utf-8"),
            headers={
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
        )
        with urllib.request.urlopen(post_req, timeout=3.5) as resp:
            text = resp.read().decode("utf-8", errors="ignore")
            for m in re.finditer(r'\["garturlres","(https?://[^"]+)"', text):
                return m.group(1)
            urls = re.findall(r"https?://(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_\+.~#?&//=]*", text)
            for u in urls:
                if "google" not in u and "gstatic" not in u:
                    return u
    except Exception as e:
        logger.debug(f"Failed decoding google news url: {e}")
    return None


def extract_newspaper_hero_image(url: str) -> Optional[str]:
    """Fetches the newspaper article HTML and extracts the hero/featured image from metadata."""
    try:
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}
        )
        with urllib.request.urlopen(req, timeout=3.0) as resp:
            # Read first 65KB which contains the document head and open-graph metadata
            html = resp.read(65536).decode("utf-8", errors="ignore")
            og_img = re.search(r'<meta\s+property=[\"\x27]og:image[\"\x27]\s+content=[\"\x27]([^\x27\"]+)[\"\x27]', html, re.I)
            if not og_img:
                og_img = re.search(r'<meta\s+content=[\"\x27]([^\x27\"]+)[\"\x27]\s+property=[\"\x27]og:image[\"\x27]', html, re.I)
            if not og_img:
                og_img = re.search(r'<meta\s+name=[\"\x27]twitter:image[\"\x27]\s+content=[\"\x27]([^\x27\"]+)[\"\x27]', html, re.I)
            if not og_img:
                og_img = re.search(r'<link\s+rel=[\"\x27]image_src[\"\x27]\s+href=[\"\x27]([^\x27\"]+)[\"\x27]', html, re.I)
            if og_img:
                img_url = og_img.group(1).replace("&amp;", "&").strip()
                if img_url.startswith("//"):
                    img_url = "https:" + img_url
                elif img_url.startswith("/"):
                    parsed = urllib.parse.urlparse(url)
                    img_url = f"{parsed.scheme}://{parsed.netloc}{img_url}"
                if img_url.startswith("http://") or img_url.startswith("https://"):
                    return img_url
    except Exception as e:
        logger.debug(f"Failed extracting hero image from {url}: {e}")
    return None


class NewsService:
    def __init__(self):
        try:
            from dotenv import load_dotenv
            load_dotenv()
        except Exception:
            pass
        self.gnews_key = (os.getenv("GNEWS") or os.getenv("GNEWS_API_KEY") or "").strip()
        self.newsdata_key = (os.getenv("NEWSDATA") or os.getenv("NEWSDATA_API_KEY") or "").strip()
        self.cache: Dict[str, Dict[str, Any]] = {}
        self.cache_ttl = 1800  # 30 minutes cache

    def _get_api_keys(self):
        if not self.gnews_key:
            self.gnews_key = (os.getenv("GNEWS") or os.getenv("GNEWS_API_KEY") or "").strip()
        if not self.newsdata_key:
            self.newsdata_key = (os.getenv("NEWSDATA") or os.getenv("NEWSDATA_API_KEY") or "").strip()

    def _get_cache(self, key: str) -> Optional[Dict[str, Any]]:
        if key in self.cache:
            entry = self.cache[key]
            if time.time() - entry["timestamp"] < self.cache_ttl:
                return entry["data"]
        return None

    def _set_cache(self, key: str, data: Dict[str, Any]):
        self.cache[key] = {
            "timestamp": time.time(),
            "data": data
        }

    def fetch_google_rss(self, query: str, limit: int = 10) -> Tuple[List[Dict[str, Any]], str]:
        """Fetches real-time authentic crime news via Google News RSS for Indian publications."""
        try:
            url = f"https://news.google.com/rss/search?q={urllib.parse.quote(query)}&hl=en-IN&gl=IN&ceid=IN:en"
            req = urllib.request.Request(
                url,
                headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
            )
            with urllib.request.urlopen(req, timeout=4.5) as resp:
                xml_data = resp.read()
                root = ET.fromstring(xml_data)
                items = root.findall(".//item")
                results = []
                for it in items[:limit]:
                    raw_title = it.findtext("title") or ""
                    link = it.findtext("link") or ""
                    pub_date = it.findtext("pubDate") or ""
                    source_elem = it.findtext("source")
                    desc = it.findtext("description") or ""

                    clean_desc = re.sub(r"<[^>]+>", "", desc).strip()

                    headline = raw_title
                    publisher = source_elem or "Regional Media"
                    if " - " in raw_title:
                        parts = raw_title.rsplit(" - ", 1)
                        headline = parts[0].strip()
                        if not source_elem or source_elem == "News":
                            publisher = parts[1].strip()

                    # Format clean date (e.g., "14 Sep 2026")
                    date_clean = "Recent"
                    if pub_date:
                        date_parts = pub_date.split()
                        if len(date_parts) >= 4:
                            date_clean = f"{date_parts[1]} {date_parts[2]} {date_parts[3]}"
                        else:
                            date_clean = pub_date[:16]

                    results.append({
                        "headline": headline,
                        "publisher": publisher,
                        "published_at": date_clean,
                        "description": clean_desc or headline,
                        "source": publisher,
                        "url": link
                    })
                return results, "SUCCESS"
        except Exception as e:
            logger.warning(f"Error fetching Google News RSS for {query}: {e}")
            return [], f"RSS_ERROR_{str(e)[:30]}"

    def fetch_newsdata(self, query: str, limit: int = 5) -> Tuple[List[Dict[str, Any]], str]:
        self._get_api_keys()
        if not self.newsdata_key:
            return [], "API_KEY_MISSING"
        try:
            params = {
                "apikey": self.newsdata_key,
                "q": query,
                "language": "en",
                "country": "in"
            }
            url = f"https://newsdata.io/api/1/news?{urllib.parse.urlencode(params)}"
            req = urllib.request.Request(url, headers={"User-Agent": "ANVESHA/2.0"})
            with urllib.request.urlopen(req, timeout=4.0) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                results_raw = data.get("results", [])
                results = []
                for a in results_raw[:limit]:
                    title = a.get("title") or ""
                    desc = a.get("description") or ""
                    pub_date = a.get("pubDate") or "Recent"
                    results.append({
                        "headline": title,
                        "publisher": a.get("source_id", "Regional News").title(),
                        "published_at": pub_date[:10] if pub_date != "Recent" else pub_date,
                        "description": desc,
                        "source": "NewsData.io",
                        "url": a.get("link", "https://tnpolice.gov.in")
                    })
                return results, "SUCCESS"
        except Exception as e:
            return [], f"ERROR_{str(e)[:40]}"

    def fetch_gnews(self, query: str, limit: int = 5) -> Tuple[List[Dict[str, Any]], str]:
        self._get_api_keys()
        if not self.gnews_key:
            return [], "API_KEY_MISSING"
        try:
            params = {
                "q": query,
                "lang": "en",
                "country": "in",
                "max": max(1, min(limit, 10)),
                "apikey": self.gnews_key
            }
            url = f"https://gnews.io/api/v4/search?{urllib.parse.urlencode(params)}"
            req = urllib.request.Request(url, headers={"User-Agent": "ANVESHA/2.0"})
            with urllib.request.urlopen(req, timeout=4.0) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                articles = data.get("articles", [])
                results = []
                for a in articles:
                    title = a.get("title") or ""
                    desc = a.get("description") or ""
                    results.append({
                        "headline": title,
                        "publisher": a.get("source", {}).get("name", "GNews Publisher"),
                        "published_at": a.get("publishedAt", "Recent")[:10],
                        "description": desc,
                        "source": "GNews",
                        "url": a.get("url", "https://tnpolice.gov.in")
                    })
                return results, "SUCCESS"
        except Exception as e:
            return [], f"ERROR_{str(e)[:40]}"

    def _extract_year(self, published_at: str) -> Optional[int]:
        if not published_at:
            return None
        match = re.search(r"\b(20\d\d|19\d\d)\b", published_at)
        if match:
            return int(match.group(1))
        return None

    def _classify_stage(self, text: str) -> str:
        for stage, keywords in STAGE_KEYWORDS.items():
            if any(k in text for k in keywords):
                return stage
        return "Reporting / Incident Note"

    def _score_and_annotate(
        self,
        article: Dict[str, Any],
        district: str,
        category: str,
        year_cutoff: Optional[int] = None
    ) -> Optional[Dict[str, Any]]:
        headline = article.get("headline", "")
        desc = article.get("description", "")
        text = f"{headline} {desc}".lower()
        dist_key = district.upper()
        cat_key = category.upper()

        aliases = DISTRICT_ALIASES.get(dist_key, [district.lower()])
        synonyms = CATEGORY_SYNONYMS.get(cat_key, [category.lower().replace("_", " ")])

        has_district = any(alias in text for alias in aliases)
        has_category = any(s in text for s in synonyms)
        is_tn_regional = any(k in text for k in ["tamil nadu", "puducherry", "chennai", "scrb", "dgp", "tn police"])

        # Reject entirely irrelevant national noise
        if not (has_district or is_tn_regional):
            return None
        if not (has_category or any(w in text for w in ["crime", "police", "arrest", "fir", "robbery", "theft", "murder", "patrol", "scam", "court"])):
            return None

        pub_year = self._extract_year(article.get("published_at", ""))
        is_after_cutoff = False
        if year_cutoff and pub_year and pub_year > year_cutoff:
            is_after_cutoff = True

        stage = self._classify_stage(text)

        if has_district:
            location_relevance = f"Local ({district})"
            level = "LOCAL NEWS"
            is_local = True
        else:
            location_relevance = "Regional (Tamil Nadu)"
            level = "REGIONAL CONTEXT"
            is_local = False

        if has_category:
            matched_synonym = next((s for s in synonyms if s in text), category.lower())
            crime_relevance = f"Direct Category Match ({matched_synonym.title()})"
        else:
            crime_relevance = "Law & Order Context"

        factual_summary = desc[:160] + "..." if len(desc) > 160 else desc or headline

        why_relevant = (
            f"Documents local police handling and situational dynamics of "
            f"{category.replace('_', ' ').lower()} in {district}."
            if is_local else
            f"Provides broader regional law enforcement context across Tamil Nadu "
            f"relevant to {category.replace('_', ' ').lower()}."
        )

        article_copy = dict(article)
        article_copy["location_relevance"] = location_relevance
        article_copy["crime_relevance"] = crime_relevance
        article_copy["scope"] = level
        article_copy["evidence_scope"] = level
        article_copy["why_relevant"] = why_relevant
        article_copy["factual_summary"] = factual_summary
        article_copy["stage"] = stage
        article_copy["is_local"] = is_local
        article_copy["publication_year"] = pub_year
        article_copy["is_after_cutoff"] = is_after_cutoff
        return article_copy

    def search_news(
        self,
        district: str = "Chennai",
        category: str = "Theft",
        limit: int = 6,
        year_cutoff: Optional[int] = None
    ) -> Dict[str, Any]:
        clean_cat = category.replace("_", " ").lower()
        if clean_cat == "all crime":
            clean_cat = "crime"

        cache_key = f"{district}_{category}_{limit}_{year_cutoff}".lower()
        cached = self._get_cache(cache_key)
        if cached is not None:
            return cached

        # Multi-query hierarchy
        queries = [
            f"{district} Tamil Nadu {clean_cat} crime police",
            f"{district} Tamil Nadu crime police",
            f"Tamil Nadu {clean_cat} crime police",
            f"Tamil Nadu crime police"
        ]

        raw_articles: List[Dict[str, Any]] = []
        seen_headlines = set()

        # 1. Fetch from Google News RSS (real-time, authentic local news from Indian publications)
        for q in queries:
            if len(raw_articles) >= limit * 2:
                break
            rss_articles, _ = self.fetch_google_rss(q, limit=limit)
            for a in rss_articles:
                h = a.get("headline", "").strip().lower()
                if h and h not in seen_headlines:
                    seen_headlines.add(h)
                    annotated = self._score_and_annotate(a, district, category, year_cutoff)
                    if annotated:
                        raw_articles.append(annotated)

        # 2. If still below limit, query NewsData.io
        if len(raw_articles) < limit and self.newsdata_key:
            nd_articles, _ = self.fetch_newsdata(f"{district} crime", limit=limit)
            for a in nd_articles:
                h = a.get("headline", "").strip().lower()
                if h and h not in seen_headlines:
                    seen_headlines.add(h)
                    annotated = self._score_and_annotate(a, district, category, year_cutoff)
                    if annotated:
                        raw_articles.append(annotated)

        # Filter by cutoff year if requested
        eligible_articles = []
        for a in raw_articles:
            if year_cutoff and a.get("is_after_cutoff"):
                continue
            eligible_articles.append(a)

        # Partition into Local vs Regional
        local_articles = [a for a in eligible_articles if a.get("is_local")]
        regional_articles = [a for a in eligible_articles if not a.get("is_local")]

        # Prioritize local articles, then fill with regional
        combined_prioritized = local_articles[:limit] + regional_articles[:max(0, limit - len(local_articles))]
        has_local = len(local_articles) > 0

        # Enrich top articles in parallel with direct newspaper URLs and authentic hero images
        self._enrich_articles_with_images(combined_prioritized[:limit], category)

        response_payload = {
            "status": "success",
            "district": district,
            "category": category,
            "year_cutoff": year_cutoff,
            "count": len(combined_prioritized),
            "articles": combined_prioritized[:limit],
            "local_articles": local_articles[:limit],
            "regional_articles": regional_articles[:limit],
            "has_local": has_local,
            "message": f"Retrieved {len(combined_prioritized)} authentic news items."
        }

        self._set_cache(cache_key, response_payload)
        return response_payload

    def _enrich_articles_with_images(self, articles: List[Dict[str, Any]], category: str) -> List[Dict[str, Any]]:
        """Enriches news articles with decoded direct newspaper URLs and extracted hero/featured images."""
        fallback_img = CATEGORY_FALLBACK_IMAGES.get(category.upper(), CATEGORY_FALLBACK_IMAGES.get("ALL_CRIME"))

        def enrich_one(art: Dict[str, Any]):
            try:
                # If already has a valid image, keep it
                if art.get("image_url") and str(art["image_url"]).startswith("http"):
                    return

                orig_url = art.get("url", "")
                target_url = orig_url

                # Decode Google News RSS link to the direct newspaper article URL
                if "news.google.com" in orig_url and "/articles/" in orig_url:
                    decoded = decode_google_news_url(orig_url)
                    if decoded:
                        target_url = decoded
                        art["url"] = decoded
                        art["decoded_url"] = decoded

                # Extract og:image from the real newspaper URL
                if target_url and target_url.startswith("http") and "news.google.com" not in target_url:
                    extracted_img = extract_newspaper_hero_image(target_url)
                    if extracted_img:
                        art["image_url"] = extracted_img
                        return

                # If no og:image found, apply category-specific editorial visual
                art["image_url"] = fallback_img
            except Exception as e:
                art["image_url"] = fallback_img

        if articles:
            with ThreadPoolExecutor(max_workers=min(5, len(articles))) as executor:
                list(executor.map(enrich_one, articles))

        return articles

news_service = NewsService()
