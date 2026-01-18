# Terminus Station Audit
**Objective**: Verify if incoming trains ("Shadow Arrivals") appear in the departure feed for major terminus stations, and if the generic fix (`naptanId === destinationNaptanId`) is sufficient.

## Stations to Check

### Victoria Line
- [ ] Walthamstow Central (`940GZZLUWWL`) - Northbound becomes Southbound?

### Northern Line
- [ ] Morden (`940GZZLUMDN`)
- [ ] Edgware (`940GZZLUEGW`)
- [ ] High Barnet (`940GZZLUHBT`)

### Central Line
- [ ] Epping (`940GZZLUEPG`)
- [ ] West Ruislip (`940GZZLUWRP`)

### Jubilee Line
- [ ] Stanmore (`940GZZLUSTM`)
- [ ] Stratford (`940GZZLUSTD`)

### Bakerloo Line
- [ ] Harrow & Wealdstone (`940GZZLUHAW`)
- [ ] Elephant & Castle (`940GZZLUEAC`)

### District Line
- [ ] Upminster (`940GZZLUUPM`)
- [ ] Ealing Broadway (`940GZZLUEBY`)
- [ ] Richmond (`940GZZLURMD`)
- [ ] Wimbledon (`940GZZLUWIM`)

## Methodology
For each station:
1. Fetch live predictions from `https://api.tfl.gov.uk/Line/{line}/Arrivals/{id}`.
2. Check for entries where `destinationNaptanId` matches the query ID.
3. Check `platformName` and `direction` fields for these terminating trains to see if they mimic departures.
