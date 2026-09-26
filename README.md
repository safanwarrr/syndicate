# Syndicate

**AI buying agents that let small vintage resellers co-buy one wholesale bale.**

Small resellers can't afford a 100-piece bale and don't want most of it. In Syndicate, each reseller briefs an agent in plain English. The agents then:

1. **Discover:** score every bale on the market against everyone's mandates.
2. **Form a syndicate:** join up around the bale that best fits the group.
3. **Negotiate:** bargain with the supplier's agent, live.
4. **Split:** divide the pieces and cost fairly by value.
5. **Get sign-off:** each human approves their own share. Nothing is bought without it.

Grok reads the briefs and voices the agents. A deterministic engine sets every price, so an agent can never exceed a reseller's mandate.

## Deploy

1. Upload this folder to a new GitHub repo.
2. In Vercel, go to Add New, then Project, and import the repo. Leave all settings as they are and click Deploy.
3. Optional: in Vercel, open Settings, then Environment Variables, and add `XAI_API_KEY`. Then redeploy.
   Without a key the app runs in scripted offline mode, which still works fully.

All data is fictional. No payment is taken.
