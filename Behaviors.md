# Scenarios

## Scenario 1.1: Remote Is In A Match And Echo Is Not Runnining On Computer

**Given** Echo is running on the remote
AND the remote is in a match
AND Echo is NOT running on the computer
**When** The program realizes this
**Then** Open Echo with Remote match session

## Scenario 1.2: Remote Is NOT In A Match And Echo Is Runnining On Computer

**Given** Echo is running on the remote
AND the remote is NOT in a match
AND Echo is running on the computer
**When** The program realizes this
**Then** Close Echo

## Scenario 1.3: Remote Is In The Same Match As Computer

**Given** Echo is running on the remote
AND the remote is in a match
AND Echo is running on the computer
AND the computer is in a match
AND the computer match is the same as the remote match
**When** The program realizes this
**Then** Do nothing

## Scenario 1.4: Remote Is NOT In The Same Match As Computer

**Given** Echo is running on the remote
AND the remote is in a match
AND Echo is running on the computer
AND the computer is in a match
AND the computer match is NOT the same as the remote match
**When** The program realizes this
**Then** Close Echo
AND Open Echo with Remote match session

## Scenario 1.5: Echo Is NOT Running On Remote or Computer

**Given** Echo is NOT running on the remote
AND Echo is NOT running on the computer
**When** The program realizes this
**Then** Do nothing

## Scenario 1.6: Remote Is NOT In A Match And Echo Is NOT Runnining On Computer

**Given** Echo is running on the remote
AND the remote is NOT in a match
AND Echo is NOT running on the computer
**When** The program realizes this
**Then** Do nothing

## Scenario 1.7: Echo Is Not Running On Remote And Echo Is Runnining On Computer

**Given** Echo is not running on remote
AND Echo is running on the computer
**When** The program realizes this
**Then** Close Echo

## Scenario 1.8: Echo is running on local but no local API data is given

(The local Echo instance is most likely currently joining into a match)

**Given** Echo is running on the computer
AND the computer is not respoding to API calls
**When** The program realizes this
**Then** Program increments the timed out call counter
and tries again

## Scenario 1.9 Echo is running on local but no API data is given after 4 consecutive calls

**Given** Echo is running on the computer
AND the computer is not respoding to API calls
**When** The program realizes this
**Then** Program closes Echo and resets counter

## Notes

- run script, close game, and scenario 1.8 occurs and doesn't restart game
- game doesn't accept new spectators after 1:30 (maybe)??
