import { NgModule, Pipe, PipeTransform } from "@angular/core";
import { JoinType, LEVELS, PersonIdType, GroupIdType } from './define';

@Pipe({name: 'joinTypeLabel'})
export class JoinTypeLabelPipe implements PipeTransform {

    transform(value: JoinType) {
        return JoinType[value];
    }
    
}

@Pipe({name: 'levelLabel'})
export class LevelLabelPipe implements PipeTransform {

    transform(value: number, type: JoinType) {
        return LEVELS[type][value]
    }
    
}

@Pipe({name: 'personCardLabel'})
export class PersonCardLabel implements PipeTransform {
    transform(value: PersonIdType) {
        return PersonIdType[value];
    }
}

@Pipe({name: 'groupCardLabel'})
export class GroupCardLabel implements PipeTransform{
    transform(value: GroupIdType) {
        return GroupIdType[value];
    }
}

@NgModule({
    declarations:[JoinTypeLabelPipe,LevelLabelPipe,GroupCardLabel,PersonCardLabel],
    exports: [JoinTypeLabelPipe,LevelLabelPipe,GroupCardLabel,PersonCardLabel]
})
export class SharedDataModule{}