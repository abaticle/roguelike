
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
 * @property {number} teamId Squad team entity id
 * @property {string} ai Squad AI
 */
 
/**
 * @typedef {object} ActorComponent Actor component
 * @property {string} name Component name
 * @property {string} desc Actor description
 * @property {number} health Actor health
 * @property {number} maxHealth Actor max health
 * @property {number} teamId Actor team entity id
 * @property {number} squadId Actor squad entity id
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
 */

/** 
 * @typedef {object} BattleComponent Battle scene component
 * @property {string} name Component name
 * @property {boolean} newTurn New turn ?
 * @property {number} speed Animation speed
 * @property {number} turn Current turn
 * @property {any} actions Actions list
 * @property {undefined|number} selectedUnit Selected unit id
 * @property {undefined|number} selectedSquad Selected unit id
 */

 
/**
 * @typedef {object} PrepareBattleComponent Prepare battle scene component 
 * @property {string} name Component name
 * @property {undefined|number} placingSquadId Current squad beeing placed
 * @property {Position} from Mouse from posititon 
 * @property {Position} to Mouse to position
 * @property {boolean} canConfirm Squad formation can be confirmed ?
 * @property {boolean} battleReady Battle can be launched ? 
 */
 
/**
 * @typedef {object} MapComponent Map component
 * @property {string} name Component name
 * @property {number} width Map width
 * @property {number} height Map height
 * @property {number[][]} layout Map layout
 * @property {Phaser.Tilemaps.Tilemap} tilemap Phaser tilemap
 * @property {PF.Grid} grid PathFinding Grid
 * @property {PF.Finder} finder 
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
  * @property {string} Message description 
  */
 
  /**
  * @typedef {object} AttackMeleeMessage Melee attack message
  */

 /**
  * @typedef {object} AttackRangedMessage Ranged attack message
  */ 
 
  /**
  * @typedef {object} DieMessage Die message
  */