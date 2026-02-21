import { PipelineState } from './state'

export function routeAfterMeeting(state: PipelineState): 'interested' | 'not_interested' {
  return state.adminDecision === 'interested' ? 'interested' : 'not_interested'
}

export function routeAfterReview(state: PipelineState): 'approved' | 'revise' {
  return state.adminDecision === 'approved' ? 'approved' : 'revise'
}
