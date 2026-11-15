import type {OtherCaseId} from './caseEvidenceEngine'
import StoryRescue from './StoryRescue'

/** Preserve the existing case route, with no quizzes, tests or number inputs. */
export default function CaseRescue({caseId}:{caseId:OtherCaseId}){
 return <StoryRescue caseId={caseId}/>
}
