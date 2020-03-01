/* eslint-disable no-console */
import { register } from 'register-service-worker'
import SWUpdateEvent from './SWUpdateEvent'
import event from './eventbus'

if (process.env.NODE_ENV === 'production') {
	register(`${process.env.BASE_URL}service-worker.js`, {
		ready() {
			console.log(
				'App is being served from cache by a service worker.\n' +
					'For more details, visit https://goo.gl/AFskqB'
			)
			event.$emit('sw-ready')
		},
		registered() {
			console.log('Service worker has been registered.')
		},
		cached(registration) {
			console.log('Content has been cached for offline use.')
			event.$emit('sw-cached', new SWUpdateEvent(registration))
		},
		updatefound(registration) {
			console.log('New content is downloading.')
			event.$emit('sw-updatefound', new SWUpdateEvent(registration))
		},
		updated(registration) {
			console.log('New content is available; please refresh.')
			event.$emit('sw-updated', new SWUpdateEvent(registration))
		},
		offline() {
			console.log(
				'No internet connection found. App is running in offline mode.'
			)
			event.$emit('sw-offline')
		},
		error(error) {
			console.error('Error during service worker registration:', error)
			event.$emit('sw-error', error)
		}
	})
}
