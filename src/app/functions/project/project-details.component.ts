import { OnInit, Component } from '@angular/core';
import { Project, JoinCorp } from 'src/app/shared/data/project';
import { ActivatedRoute } from '@angular/router';


@Component({selector: "project-details", templateUrl: "./details.html"})
export class ProjectDetailsComponent implements OnInit{
    ngOnInit(): void {
    }

}

@Component({selector: "project-info", templateUrl:"./info.html", styleUrls:['./info.scss']})
export class ProjectInfoComponent implements OnInit{

    project: Project;

    developer: JoinCorp;

    constructor(private _route: ActivatedRoute){}

    ngOnInit(): void {
        this._route.data.subscribe(data => {
            this.project = data.project;
            this.developer = this.project.corp.corps.filter(corp => (corp.property === 'Developer'))[0]
        })
    }

}

@Component({selector: "project-business", templateUrl:"./business.html"})
export class ProjectBusinessComponent implements OnInit{
    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }

}