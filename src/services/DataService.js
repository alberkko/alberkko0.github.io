import axios from 'axios'

// Defines if data will be loaded in remote or from "data" folder. Set truf if remote.
const remotedata = true

const urls = {
	en: 'ajxDt.php?apprcss=ironaltas&crd=3,0,0,0,0,0',
	de: 'ajxDt.php?apprcss=ironaltas&crd=4,0,0,0,0,0',
	fr: 'ajxDt.php?apprcss=ironaltas&crd=10,0,0,0,0,0',
	es: 'ajxDt.php?apprcss=ironaltas&crd=9,0,0,0,0,0'
}

const remoteBaseURL = 'https://ironatlas.medline.ch'
const internalBaseURL = './data'

const apiClient = axios.create({
	baseURL: remotedata ? remoteBaseURL : internalBaseURL,
	withCredentials: false, // This is the default
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	},
	timeout: 30000
})

export default {
	getData(code) {
		let file = ''
		if (remotedata) {
			file = urls[code]
		} else {
			file = code + '.json'
		}
		//console.log(apiClient.get())
		//return apiClient.get('/data/')
		return apiClient.get(file)
	}
}
