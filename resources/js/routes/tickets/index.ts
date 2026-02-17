import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\TicketController::scan
 * @see app/Http/Controllers/TicketController.php:33
 * @route '/tickets/scan'
 */
export const scan = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: scan.url(options),
    method: 'post',
})

scan.definition = {
    methods: ["post"],
    url: '/tickets/scan',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TicketController::scan
 * @see app/Http/Controllers/TicketController.php:33
 * @route '/tickets/scan'
 */
scan.url = (options?: RouteQueryOptions) => {
    return scan.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TicketController::scan
 * @see app/Http/Controllers/TicketController.php:33
 * @route '/tickets/scan'
 */
scan.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: scan.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TicketController::scan
 * @see app/Http/Controllers/TicketController.php:33
 * @route '/tickets/scan'
 */
    const scanForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: scan.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TicketController::scan
 * @see app/Http/Controllers/TicketController.php:33
 * @route '/tickets/scan'
 */
        scanForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: scan.url(options),
            method: 'post',
        })
    
    scan.form = scanForm
const tickets = {
    scan: Object.assign(scan, scan),
}

export default tickets