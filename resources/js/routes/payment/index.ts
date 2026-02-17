import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\PaymentController::notification
 * @see app/Http/Controllers/PaymentController.php:27
 * @route '/payment/notification'
 */
export const notification = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: notification.url(options),
    method: 'post',
})

notification.definition = {
    methods: ["post"],
    url: '/payment/notification',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PaymentController::notification
 * @see app/Http/Controllers/PaymentController.php:27
 * @route '/payment/notification'
 */
notification.url = (options?: RouteQueryOptions) => {
    return notification.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PaymentController::notification
 * @see app/Http/Controllers/PaymentController.php:27
 * @route '/payment/notification'
 */
notification.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: notification.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PaymentController::notification
 * @see app/Http/Controllers/PaymentController.php:27
 * @route '/payment/notification'
 */
    const notificationForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: notification.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PaymentController::notification
 * @see app/Http/Controllers/PaymentController.php:27
 * @route '/payment/notification'
 */
        notificationForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: notification.url(options),
            method: 'post',
        })
    
    notification.form = notificationForm
const payment = {
    notification: Object.assign(notification, notification),
}

export default payment