import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  HostListener
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { GlobalService } from "../../global.service";
import { DataService } from "../../data.service";

const ESCAPE = 27;

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"]
})
export class AboutComponent implements OnInit {
  @Output() closeAbout = new EventEmitter<boolean>();
  version: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private dataService: DataService
  ) {}

  @HostListener("document:keydown", ["$event"])
  private handleKeydown(event: KeyboardEvent) {
    if (event.keyCode === ESCAPE) {
      this.closeAbout.emit(true);
    }
  }

  onClickBackground() {
    this.closeAbout.emit(true);
  }

  onClickClose() {
    this.closeAbout.emit(true);
  }

  ngOnInit() {
    this.version = this.globalService.VERSION;
    //console.log(this.version);
  }
}
