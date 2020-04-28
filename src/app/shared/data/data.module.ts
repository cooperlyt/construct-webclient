import { NgModule} from "@angular/core";
import { JoinTypeLabelPipe, LevelLabelPipe, GroupCardLabelPipe, PersonCardLabelPipe, LevelKeyLabelPipe, ProjectPropertyLabelPipe, ProjectTypeClassLabelPipe, ProjectTypeLabelPipe, ImportantTypeLabelPipe, FloorTypePipe, ProjectTypeLevelLabelPipe, StructLabelPipe } from './define';



@NgModule({
    declarations:[JoinTypeLabelPipe,LevelLabelPipe,GroupCardLabelPipe,PersonCardLabelPipe,LevelKeyLabelPipe,ProjectPropertyLabelPipe,ProjectTypeClassLabelPipe,ProjectTypeLabelPipe,ImportantTypeLabelPipe,FloorTypePipe,ProjectTypeLevelLabelPipe,StructLabelPipe],
    exports: [JoinTypeLabelPipe,LevelLabelPipe,GroupCardLabelPipe,PersonCardLabelPipe,LevelKeyLabelPipe,ProjectPropertyLabelPipe,ProjectTypeClassLabelPipe,ProjectTypeLabelPipe,ImportantTypeLabelPipe,FloorTypePipe,ProjectTypeLevelLabelPipe,StructLabelPipe]
})
export class SharedDataModule{}