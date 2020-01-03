import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  SimpleChanges
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { GlobalService } from "./global.service";
import { DataService } from "./data.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  torrents: any;
  torrent: any;
  isRoot: boolean = window.location.pathname == "/" ? true : false;
  isMobile: boolean = window.innerWidth < 770;
  isRPCOK: boolean;
  isRPCBad: boolean;
  openInfo: boolean;
  shortMode: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private dataService: DataService
  ) {}

  onFocus(id: any) {
    this.openInfo = true;
    this.shortMode = true;
    for (let i = 0; i < this.torrents.length; i++) {
      if (this.torrents[i].id == id) {
        this.torrent = this.torrents[i];
      }
    }
  }

  onCloseInfo() {
    console.log("fired");
    this.openInfo = false;
    this.shortMode = false;
  }

  ngOnInit() {
    this.dataService.rpc().subscribe(res => {
      if (res.status == 502) {
        this.isRPCBad = true;
        //console.log("502 error");
      } else {
        this.isRPCOK = true;
        this.dataService.getTorrents().subscribe(res => {
          if (res != null && res.result == "success") {
            this.torrents = res.arguments.torrents;
          }
        });
        this.dataService.getSession().subscribe(res => {
          //console.log(res)
          if (res != null && res.result == "success") {
            /*
            this.session= res.arguments.torrents;
            this.change.emit(this.torrents);
						*/
          }
        });
      }
    });
  }
}
