class App {
    constructor() {
        this.url = 'resources.json'
        this.resourcesEl = document.querySelector('.resources')

        const filterIds = ['type-select', 'category-select', 'audience-select', 'location-select']

        this.filterEls = filterIds.map(id => document.getElementById(id))
    }

    async init() {
        this.resources = await this.getResources()
        this.filterResources()

        for (const el of this.filterEls) {
            el.addEventListener('change', () => this.filterResources())
        }
    }

    async getResources() {
        try {
            const response = await fetch(this.url)

            if (!response.ok) throw new Error('Bad response')
            
            const resources = await response.json()

            return resources
        } catch {
            return []
        }
    }

    getFiltersValues() {
        return this.filterEls.reduce((acc, el) => {
            acc[el.name] = el.value
            return acc
        }, {})
    }

    filterResources() {
        const filter = this.getFiltersValues()
        
        const filteredResources = this.resources.filter(resource => {
            return Object.keys(filter).every(key => {
                if (filter[key] == 'all') {
                    return true
                }
                const filterValues = filter[key].split(',').map(val => val.trim())
                const resourceValues = resource[key].split(',').map(val => val.trim())
                return filterValues.every(val => resourceValues.includes(val))
            })
        })

        this.resourcesEl.innerHTML = ''

        for (const resource of filteredResources) {
            const el = strToDOM(`
                <div class="resource-card">${resource['Service Name']}</div>
            `)

            this.resourcesEl.append(el)
        }
    }

    buildFilters() {
        // Todo maybe
    }
}

const strToDOM = str => document.createRange().createContextualFragment(str.trim())

const getUniqueValues = (services, key) => (
    [...new Set(services.map(service => service[key]))]
)

new App().init()