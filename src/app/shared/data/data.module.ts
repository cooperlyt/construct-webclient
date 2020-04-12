import { NgModule} from "@angular/core";
import { JoinTypeLabelPipe, LevelLabelPipe, GroupCardLabel, PersonCardLabel } from './define';



@NgModule({
    declarations:[JoinTypeLabelPipe,LevelLabelPipe,GroupCardLabel,PersonCardLabel],
    exports: [JoinTypeLabelPipe,LevelLabelPipe,GroupCardLabel,PersonCardLabel]
})
export class SharedDataModule{}