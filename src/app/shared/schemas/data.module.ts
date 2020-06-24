import { NgModule} from "@angular/core";
import { JoinTypeLabelPipe, LevelLabelPipe, GroupCardLabelPipe, PersonCardLabelPipe, LevelKeyLabelPipe, ProjectPropertyLabelPipe, ProjectTypeClassLabelPipe, ProjectTypeLabelPipe, ImportantTypeLabelPipe, FloorTypePipe, ProjectTypeLevelLabelPipe, StructLabelPipe, ProjectModifyTypeLabelPipe } from './define';



@NgModule({
    declarations:[JoinTypeLabelPipe,LevelLabelPipe,GroupCardLabelPipe,PersonCardLabelPipe,LevelKeyLabelPipe,ProjectPropertyLabelPipe,ProjectTypeClassLabelPipe,ProjectTypeLabelPipe,ImportantTypeLabelPipe,FloorTypePipe,ProjectTypeLevelLabelPipe,StructLabelPipe,ProjectModifyTypeLabelPipe],
    exports: [JoinTypeLabelPipe,LevelLabelPipe,GroupCardLabelPipe,PersonCardLabelPipe,LevelKeyLabelPipe,ProjectPropertyLabelPipe,ProjectTypeClassLabelPipe,ProjectTypeLabelPipe,ImportantTypeLabelPipe,FloorTypePipe,ProjectTypeLevelLabelPipe,StructLabelPipe,ProjectModifyTypeLabelPipe]
})
export class SharedDataModule{}