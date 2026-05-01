import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ReviewController::store
 * @see app/Http/Controllers/ReviewController.php:11
 * @route '/reviews'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/reviews',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ReviewController::store
 * @see app/Http/Controllers/ReviewController.php:11
 * @route '/reviews'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReviewController::store
 * @see app/Http/Controllers/ReviewController.php:11
 * @route '/reviews'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ReviewController::store
 * @see app/Http/Controllers/ReviewController.php:11
 * @route '/reviews'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ReviewController::store
 * @see app/Http/Controllers/ReviewController.php:11
 * @route '/reviews'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const reviews = {
    store: Object.assign(store, store),
}

export default reviews