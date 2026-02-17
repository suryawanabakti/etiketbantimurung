import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\TicketController::view
 * @see app/Http/Controllers/TicketController.php:19
 * @route '/tickets/scan'
 */
export const view = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: view.url(options),
    method: 'get',
})

view.definition = {
    methods: ["get","head"],
    url: '/tickets/scan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TicketController::view
 * @see app/Http/Controllers/TicketController.php:19
 * @route '/tickets/scan'
 */
view.url = (options?: RouteQueryOptions) => {
    return view.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TicketController::view
 * @see app/Http/Controllers/TicketController.php:19
 * @route '/tickets/scan'
 */
view.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: view.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TicketController::view
 * @see app/Http/Controllers/TicketController.php:19
 * @route '/tickets/scan'
 */
view.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: view.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TicketController::view
 * @see app/Http/Controllers/TicketController.php:19
 * @route '/tickets/scan'
 */
    const viewForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: view.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TicketController::view
 * @see app/Http/Controllers/TicketController.php:19
 * @route '/tickets/scan'
 */
        viewForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: view.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TicketController::view
 * @see app/Http/Controllers/TicketController.php:19
 * @route '/tickets/scan'
 */
        viewForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: view.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    view.form = viewForm