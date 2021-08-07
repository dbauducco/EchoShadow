/* eslint-disable no-restricted-syntax */
import { EventType, IEchoMatchData } from '../types';
import { Events } from '../utilities';

export default class GestureRecognizerManager {
  constructor() {
    Events.on(EventType.NewMatchData, this.checkGestures.bind(this));
  }

  private checkGestures(data: IEchoMatchData) {
    // Get the controlling hand of the player
    const clientHand = this.findClientHandPosition(data, 'right');
    // Check that the player is within the range of the terminal, in order to activate the
    // gesture checking
    if (!this.isWithinRangeOfTerminal(clientHand)) {
      return;
    }

    // Get all the other hands in this match
    const allHands = this.getAllHands(data);
    // Go through all the hands
    for (const hand of allHands) {
      const playerHand = hand.hand;
      // Check for fist bump
      if (
        this.isTouching(clientHand, playerHand) &&
        this.isFistBumping(clientHand) &&
        this.isFistBumping(playerHand)
      ) {
        // Fist bumping with this person!p
        console.log(`The client is fist bumping ${hand.owner}`);
        Events.emit(EventType.NewSpectatorTarget, `${hand.owner}#POV`);
      }
      // Check for high five
      if (
        this.isTouching(clientHand, playerHand) &&
        this.isHighFiving(clientHand) &&
        this.isHighFiving(playerHand)
      ) {
        // High fiving with this person!
        console.log(`The client is high fiving ${hand.owner}`);
        Events.emit(EventType.NewSpectatorTarget, `${hand.owner}#FOLLOW`);
      }
    }
  }

  private findClientHandPosition(data: IEchoMatchData, hand: string) {
    const blueIndex = data.game.bluePlayers.findIndex(playerData => {
      return playerData.name == data.remote.name;
    });
    const orangeIndex = data.game.orangePlayers.findIndex(playerData => {
      return playerData.name == data.remote.name;
    });

    if (blueIndex != -1) {
      const playerData = data.game.bluePlayers[blueIndex];
      if (hand == 'right') {
        return playerData.right_hand;
      }
      if (hand == 'left') {
        return playerData.left_hand;
      }
    } else if (orangeIndex != -1) {
      const playerData = data.game.orangePlayers[orangeIndex];
      if (hand == 'right') {
        return playerData.right_hand;
      }
      if (hand == 'left') {
        return playerData.left_hand;
      }
    }
  }

  private isFistBumping(handData: any) {
    return Math.abs(handData.up[1]) < 0.15;
  }

  private isHighFiving(handData: any) {
    return Math.abs(handData.up[1] + 0.5) < 0.3;
  }

  private isTouching(handData: any, otherHandData: any) {
    const x_diff = Math.abs(handData.position[0] - otherHandData.position[0]);
    const y_diff = Math.abs(handData.position[1] - otherHandData.position[1]);
    const z_diff = Math.abs(handData.position[2] - otherHandData.position[2]);
    return x_diff < 0.2 && y_diff < 0.2 && z_diff < 0.2;
  }

  private isWithinRangeOfTerminal(handData: any) {
    return true;
  }

  private getAllHands(
    matchData: IEchoMatchData
  ): { hand: number[]; owner: string }[] {
    const hands: { hand: any; owner: string }[] = [];

    // Going through all of blue team
    for (const player of matchData.game.bluePlayers) {
      if (player.name !== matchData.remote.name) {
        hands.push({ hand: player.right_hand, owner: player.name });
        hands.push({ hand: player.left_hand, owner: player.name });
      }
    }

    // Going through all of orange team
    for (const player of matchData.game.orangePlayers) {
      if (player.name !== matchData.remote.name) {
        hands.push({ hand: player.right_hand, owner: player.name });
        hands.push({ hand: player.left_hand, owner: player.name });
      }
    }

    return hands;
  }
}
