
/** 
 * @typedef {number|undefined} EntityId Entity Id
 */

/**
 * @typedef {object} TeamComponent Team component
 * @property {string} name Component name
 * @property {string} desc Team description
 * @property {number} count Alive units count
 */
 
/**
 * @typedef {object} PositionComponent Position component
 * @property {string} name Component name
 * @property {number} x X Position
 * @property {number} y Y Position
 */
 
/**
 * @typedef {object} SquadComponent Squad component
 * @property {string} name Component name
 * @property {string} desc Actor description
 * @property {boolean} placed 
 * @property {number} number Squad number
 * @property {EntityId} teamId Squad team entity id
 * @property {string} ai Squad AI
 */
 
/**
 * @typedef {object} ActorComponent Actor component
 * @property {string} name Component name
 * @property {string} desc Actor description
 * @property {number} health Actor health
 * @property {number} maxHealth Actor max health
 * @property {EntityId} teamId Actor team entity id
 * @property {EntityId} squadId Actor squad entity id
 * @property {boolean} inBattle In battle ?
 */
 
/**
 * @typedef {object} DisplayComponent Actor component
 * @property {string} name Component name
 * @property {Phaser.GameObjects.Container} container Phaser container
 * @property {boolean} selectorVisible Selector visible ?
 * @property {boolean} draw Draw component ?
 * @property {number} frame Frame id
 */

/**
 * @typedef {object} GameComponent Game component
 * @property {string} name Component name
 * @property {Phaser.Scene} scene Current Phaser scene
 * @property {boolean} debug Debug mode activated
 */

/** 
 * @typedef {object} BattleComponent Battle scene component
 * @property {string} name Component name
 * @property {boolean} newTurn New turn ?
 * @property {number} speed Animation speed
 * @property {number} turn Current turn
 * @property {Message[]} actions Actions list
 * @property {EntityId} selectedUnit Selected unit id
 * @property {EntityId} selectedSquad Selected unit id
 * @property {boolean} drawn Unit already drawn ?
 * @property {Phaser.GameObjects.Line[]} lines
 * @property {boolean} actionsDrawn
 */

 
/**
 * @typedef {object} PrepareBattleComponent Prepare battle scene component 
 * @property {string} name Component name
 * @property {EntityId} placingSquadId Current squad beeing placed
 * @property {MousePosition} from Mouse from posititon 
 * @property {MousePosition} to Mouse to position
 * @property {boolean} canConfirm Squad formation can be confirmed ?
 * @property {boolean} battleReady Battle can be launched ? 
 */

 // @ts-ignore
/**
 * @typedef {object} MapComponent Map component
 * @property {string} name Component name
 * @property {number} width Map width
 * @property {number} height Map height
 * @property {number[][]} layout Map layout
 * @property {Phaser.Tilemaps.Tilemap} tilemap Phaser tilemap
 * @property {PF.Grid} grid PathFinding Grid         
 * @property {PF.Finder} finder PathFinding Finder
 */

 /**    
  * @typedef {object} MapPosition Map position
  * @property {number} x Map X position
  * @property {number} y Map Y position
  */

 /**    
  * @typedef {object} MousePosition Mouse position
  * @property {number} x Mouse X position
  * @property {number} y Mouse Y position
  */

 /**
  * @typedef {object} MoveMessage Move message
  * @property {string} type Message type : "move"
  * @property {number} entityId Moving entity
  * @property {MapPosition} nextPosition New position
  * @property {string} description Message description 
  */
 
  /**
  * @typedef {object} AttackMeleeMessage Melee attack message
  * @property {string} type Message type : "attackMelee"
  * @property {EntityId} from Attacking entity
  * @property {EntityId} to Attacked entity
  * @property {number} damages Damages done
  * @property {string} description Message description 
  */

 /**
  * @typedef {object} AttackRangedMessage Ranged attack message
  * @property {string} type Message type : "attackRanged"
  * @property {EntityId} from Attacking entity
  * @property {EntityId} to Attacked entity
  * @property {number} damages Damages done
  * @property {string} description Message description 
  */ 
 
  /**
  * @typedef {object} DieMessage Die message
  * @property {string} type Message type : "die"
  * @property {EntityId} entityId Dieing entity id
  * @property {EntityId} killedBy Killer entity id
  * @property {number} damages Damages done
  * @property {string} description Message description 
  */

  /** @typedef {DieMessage|AttackRangedMessage|AttackMeleeMessage|MoveMessage} Message */