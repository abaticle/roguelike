import _ from "lodash"


export default class ECS {

    constructor() {
        this.entities = []
        this.entitiesComponents = {}
        this.components = {}
        this._cache = {}
        this._cacheFunctions = {}
        this.alias = {}
    }

    clearAll() {
        this.entities = []
        this.entitiesComponents = {}
        this.components = {}
        this._cache = {}
    }

    /**
     * Create an alias for an entity
     * @param {string} aliasName 
     * @param {number} entityId 
     */
    createAlias(aliasName, entityId) {

        if (this.alias[aliasName]) {
            throw new Error(`Alias ${aliasName} already exists`)
        }

        this.alias[aliasName] = entityId
    }


    /**
     * Delete an alias
     * @param {string} aliasName 
     */
    removeAlias(aliasName) {
        delete this.alias[aliasName]
    }

    /**
     * Get an entity by alias
     * @param {string} aliasName Entity alias
     * @returns {number} Entity id
     */
    getAlias(aliasName) {
        let id = this.alias[aliasName]

        if (id === undefined) {
            throw new Error(`Alias ${aliasName} doesn't exists`)
        }

        return id
    }


    /**
     * Create an entity from an assemblage
     * @param {{components: {string[]}, data: {object}, ?alias:{string}}} assemblage 
     * @returns {number} New entity id
     */
    createFromAssemblage(assemblage) {
        let entity = this.createEntity()

        //Add components 
        assemblage.components.forEach(component => {
            this.add(entity, component)
        });

        //Update data
        for (let [component, value] of Object.entries(assemblage.data)) {
            this.set(value, entity, component)
        }

        //Set alias
        if ("alias" in assemblage) {
            this.createAlias(assemblage.alias, entity)
        }

        return entity
    }

    /**
     * Get new entity id
     */
    _getNextEntityId() {
        let i = 0;
        while (true) {
            if (this.entities[i] === undefined) {
                return i
            }
            i++
        }
    }

    /**
     * Check if an entity exists
     * @param {number|string} id Id or alias of an entity
     */
    existEntity(id) {
        if (typeof id === "number") {
            return this.entities.includes(id)
        }
        if (typeof id === "string") {
            if (this.alias[id] !== undefined) {
                return true
            }
        }        
        return false
    }

    /**
     * Check component exists
     * @param {string} name Component name 
     */
    existComponent(name) {
        return this.components[name] !== undefined
    }


    /**
     * Check compoenent has property
     * @param {string} comp Component name
     * @param {*} prop Property name
     */
    existComponentProperty(comp, prop) {
        return this.components[comp].hasOwnProperty(prop)
    }

    /**
     * Create new entity
     * @param {string|string[]|undefined} components 
     * @returns {number} Newly generated entity id
     */
    createEntity(components) {
        let entityId = this._getNextEntityId()

        this.entities[entityId] = entityId

        if (components) {
            this.add(entityId, components)
        }

        return entityId
    }

    /**
     * Register a new component 
     * @param {object|object[]} component Component with a "name" property 
     */
    registerComponent(components) {

        components = [].concat(components)

        components.forEach(component => {

            if (!component["name"]) {
                throw new Error("Component need a 'name' property")
            }
    
            this.components[component.name] = component
            this.entitiesComponents[component.name] = []
        })


    }

    /**
     * Remove component(s) from an entity
     * @param {number|string} entityId Id or alias of an entity
     * @param {string|string[]} componantNames Components to remove
     */
    remove(entityId, componantNames) {

        componentNames = [].concat(componentNames)

        if (!this.existEntity(entityId)) {
            throw new Error(`Entity ${entityId} doesn't exists`)
        }
        if (typeof entityId === "string") {
            entityId = this.getAlias(entityId)
        }

        componantNames.forEach(name => {
            
            if (!this.existComponent(name)) {
                throw new Error(`Component "${name}" doesn't exists`)
            }

            //Remove component
            this.entitiesComponents[name][entityId] = undefined

            //And update cache
            this._cache = this._cache.filter()

        })
    }

    /**
     * Add component(s) to an entity
     * @param {number|string} entityId 
     * @param {string|string[]} componentNames 
     */
    add(entityId, componentNames) {
        componentNames = [].concat(componentNames)

        if (!this.existEntity(entityId)) {
            throw new Error(`Entity ${entityId} doesn't exists`)
        }

        if (typeof entityId === "string") {
            entityId = this.getAlias(entityId)
        }

        componentNames.forEach(name => {
            if (!this.existComponent(name)) {
                throw new Error(`Component "${name}" doesn't exists`)
            }
            if (this.entitiesComponents[name][entityId]) {
                throw new Error(`Entity ${entityId} already has component "${name}"`)
            }

            this._cleanCache(name);
            this.entitiesComponents[name][entityId] = _.cloneDeep(this.components[name])
            this.entitiesComponents[name][entityId]["_id"] = entityId
        })

        return this;
    }

    /**
     * Clean cache for a given component. Automaticaly called when adding or removing component to an entity
     * @param {string} componantName 
     */
    _cleanCache(componantName) {

        //Clean cached results
        for (let prop in this._cache) {
            if (prop.split("|").includes(componantName)) {
                delete this._cache[prop]
            }
        }
    }

    /**
     * Remove component(s) from an entity
     * @param {number} entityId 
     * @param {string|string[]} componentNames 
     */
    remove(entityId, componentNames) {
        componentNames = [].concat(componentNames)

        //Check parameters
        if (!this.entities.includes(entityId)) {
            throw new Error(`Entity ${entityId} doesn't exists`)
        }

        componentNames.forEach(componentName => {
            if (!this.existComponent(componentName)) {
                throw new Error(`Component "${componentName}" doesn't exists`)
            }

            delete this.entitiesComponents[componentName][entityId]

            this._cleanCache(componentName)
        })

        return this
    }

    /**
     * 
     * @param {any} value 
     * @param {number|string} entityId 
     * @param {string} componentName 
     * @param {string} property 
     */
    set(value, entityId, componentName, property) {

        let setValue = ""

        if (value === undefined) {
            throw new Error(`Value parameter is mandatory`)
        }

        if (entityId !== undefined) {
            if (!this.existEntity(entityId)) {
                throw new Error(`Entity ${entityId} doesn't exists`)
            }            
            if (typeof entityId === "string") {
                entityId = this.getAlias(entityId)
            }
            setValue = "entity"
        } else {
            throw new Error(`Entity parameter is mandatory`)
        }

        if (componentName) {
            if (!this.existComponent(componentName)) {
                throw new Error(`Component "${componentName}" doesn't exists`)
            }
            setValue = "component"
        }

        if (property) {
            if (!this.components[componentName].hasOwnProperty(property)) {
                throw new Error(`Component "${componentName}" doesn't have property "${property}"`)
            }
            setValue = "property"
        }

        switch (setValue) {
            case "":
                throw new Error("No enough arguments, minimum 2")

            case "entity":
                //Check component names:
                _.forOwn(value, (compValue, compName) => {
                    if (!this.existComponent(compName)) {
                        throw new Error(`Component "${compName}" doesn't exists`)
                    }

                    let component = this.components[compName]

                    //Check component properties
                    _.forOwn(compValue, (propValue, propName) => {
                        if (this.components[compName][propName] === undefined) {
                            throw new Error(`Property "${propName}" in component "${componentName}" doesn't exists`)
                        }
                    })
                })
                break

            case "component":
                _.forOwn(value, (propValue, propName) => {
                    if (!_.has(this.components[componentName], propName)) {
                        throw new Error(`Property "${propName}" in component "${componentName}" doesn't exists`)
                    }
                })

                this.entitiesComponents[componentName][entityId] = {
                    ...this.entitiesComponents[componentName][entityId],
                    ...value
                }
                break

            case "property":
                if (!_.has(this.components[componentName], property)) {
                    throw new Error(`Property "${property}" in component "${componentName}" doesn't exists`)
                }

                _.set(this.entitiesComponents[componentName][entityId], property, value)
                break
        }

        return this
    }

    /**
     * Get an entity, component or value from component
     * @param {number|string} entityId Entity id or alias
     * @param {string} componentName Component name
     * @param {string} path Path in component
     */
    get(entityId, componentName, path) {

        if (entityId === undefined) {
            throw new Error('Entity is undefined')
        }

        if (entityId) {
            if (typeof entityId === "string") {
                entityId = this.getAlias(entityId)
            }
            if (!this.existEntity(entityId)) {
                throw new Error(`Entity ${entityId} doesn't exists`)
            }
        }

        if (componentName) {
            if (!this.existComponent(componentName)) {
                throw new Error(`Component "${componentName}" doesn't exists`)
            }
        }

        if (path) {
            if (!_.has(this.components[componentName], path)) {
                throw new Error(`Component "${componentName}" doesn't have path "${path}"`)
            }
        }


        switch (arguments.length) {
            case 0:
                throw new Error("No arguments")

            case 1:
                return _.pickBy(_.mapValues(this.entitiesComponents, c => c[entityId]), _.identity)


            case 2:
                return this.entitiesComponents[componentName][entityId]

            case 3:
                return _.get(this.entitiesComponents[componentName][entityId], path)
        }
    }

    /**
     * Search for entities with components
     * @param {string|string[]} componentNames Component(s) to search for
     */
    searchEntities(componentNames) {
        componentNames = [].concat(componentNames)

        if (arguments.length !== 1) {
            throw new Error(`searchEntities must be called with 1 argument`)
        }

        componentNames.forEach(comp => {
            if (!this.existComponent(comp)) {
                throw new Error(`Component "${comp}" doesn't exists`)
            }
        })

        let cacheId = componentNames.sort().join('|')

        if (!this._cache[cacheId]) {

            this._cache[cacheId] = _.filter(this.entities, entityId =>
                _.every(componentNames, componantName =>
                    this.entitiesComponents[componantName][entityId] !== undefined
                )
            )

        }

        return this._cache[cacheId]
    }

    toString() {

        const stringify = (data) => {
            return JSON.stringify(data, (key, value) => value === undefined ? null : value)
        }

        return stringify({
            entities: this.entities,
            entitiesComponents: this.entitiesComponents
        })
    }


    fromString(string) {

        const parse = (str) => {
            return JSON.parse(str)
        }

        const data = parse(string)

        this.entities = data.entities
        this.entitiesComponents = data.entitiesComponents


        //Replace null with undefined in arrays 
        Object
            .entries(this.entitiesComponents)
            .forEach(([component, values]) => {
                values.forEach((val, index) => {
                    if (val === null) {
                        this.entitiesComponents[component][index] = undefined
                    }
                })
            })

        this._cache = {}
        this._cacheFunctions = {}
    }





}