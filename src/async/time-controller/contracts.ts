export interface ITimeController {
	now(): number
	setTimeout(handler: () => void, timeout: number): number
	clearTimeout(handle: number)
}

