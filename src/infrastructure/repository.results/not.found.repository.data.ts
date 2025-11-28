import { INotFoundRepositoryData } from "../../domains/.shared.domain/types";

export default class NotFoundRepositoryData implements INotFoundRepositoryData {
    public found(): false {
        return false
    }
}