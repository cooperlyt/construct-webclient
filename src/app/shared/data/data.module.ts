import { NgModule} from "@angular/core";
import { JoinTypeLabelPipe, LevelLabelPipe, GroupCardLabelPipe, PersonCardLabelPipe, LevelKeyLabelPipe, ProjectPropertyLabelPipe, ProjectTypeClassLabelPipe, ProjectTypeLabelPipe, ImportantTypeLabelPipe, FloorTypePipe, ProjectTypeLevelLabelPipe } from './define';



@NgModule({
    declarations:[JoinTypeLabelPipe,LevelLabelPipe,GroupCardLabelPipe,PersonCardLabelPipe,LevelKeyLabelPipe,ProjectPropertyLabelPipe,ProjectTypeClassLabelPipe,ProjectTypeLabelPipe,ImportantTypeLabelPipe,FloorTypePipe,ProjectTypeLevelLabelPipe],
    exports: [JoinTypeLabelPipe,LevelLabelPipe,GroupCardLabelPipe,PersonCardLabelPipe,LevelKeyLabelPipe,ProjectPropertyLabelPipe,ProjectTypeClassLabelPipe,ProjectTypeLabelPipe,ImportantTypeLabelPipe,FloorTypePipe,ProjectTypeLevelLabelPipe]
})
export class SharedDataModule{}