import { NgModule} from "@angular/core";
import { JoinTypeLabelPipe, LevelLabelPipe, GroupCardLabel, PersonCardLabel, LevelKeyLabel } from './define';



@NgModule({
    declarations:[JoinTypeLabelPipe,LevelLabelPipe,GroupCardLabel,PersonCardLabel,LevelKeyLabel],
    exports: [JoinTypeLabelPipe,LevelLabelPipe,GroupCardLabel,PersonCardLabel,LevelKeyLabel]
})
export class SharedDataModule{}