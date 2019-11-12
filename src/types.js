/**
 * @typedef {object} Position
 * @property {number} x X Position
 * @property {number} y Y Position
 */

/**
 * @typedef {object} MoveMessage 
 * @property {string} type Type of message (move)
 * @property {number} entityId Moving entity
 * @property {position} nextPosition Target position
 */

/**
 * @typedef {object} AttackMeleeMessage
 * @property {string} type Type of message (attackMelee)
 * @property {number} from Attacking entity
 * @property {number} to Target entity
 * @property {number} damages Damages dones
 */

/**
 * @typedef {object} AttackRangedMessage
 * @property {string} type Type of message (attackRanged)
 * @property {number} from Attacking entity
 * @property {number} to Target entity
 * @property {number} damages Damages dones
 */
