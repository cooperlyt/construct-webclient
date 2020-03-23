import { Injectable } from "@angular/core";
import { Resolve, RouterStateSnapshot,
    ActivatedRouteSnapshot } from '@angular/router';
import { Project } from '../model/project';
import { Observable, forkJoin, of, throwError} from 'rxjs';
import { RegisterService } from '../service/register.service';
import { DeveloperService } from '../service/developer.service';
import { flatMap, catchError } from 'rxjs/operators';
import { filter } from 'minimatch';

@Injectable({
    providedIn: 'root'
})
export class HomeResolver implements Resolve<Project[]>{

    constructor(private _registerService: RegisterService, private _developerService: DeveloperService){}

    private projectSubscribe(codes:string[]):Observable<Project[]>{
        let objarray = new Array<Observable<Project>>();
        codes.forEach(code => objarray.push(this._registerService.myProjects(code).pipe(catchError(err => {
            if (err.status == 404){
                return of(new Project());
            }else{
                throwError(err);
            }
        }))));
       
        return forkJoin(objarray);
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Project[] | Observable<Project[]> | Promise<Project[]> {
       
        console.log('call get project')
        return this._developerService.myProjects().pipe(flatMap(data=>
            this.projectSubscribe(data)
            ));

    }
}