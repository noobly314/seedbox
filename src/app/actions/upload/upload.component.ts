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
  selector: "app-upload",
  templateUrl: "./upload.component.html",
  styleUrls: ["./upload.component.css"]
})
export class UploadComponent implements OnInit {
  @Output() close = new EventEmitter<boolean>();
  filesToUpload: Array<File>;
  metainfo: Array<string>;
  download_dir: string;
  download_dir_error: boolean;
  start_when_added: boolean;
  noFilesChosen: boolean;
  uploadedNotice: string = "No files chosen";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private dataService: DataService
  ) {}

  @HostListener("document:keydown", ["$event"])
  private handleKeydown(event: KeyboardEvent) {
    if (event.keyCode === ESCAPE) {
      this.close.emit(true);
    }
  }

  onClickBackground() {
    this.close.emit(true);
  }

  onClose() {
    this.close.emit(true);
  }

  handleFilesInput(event) {
    this.metainfo = [];
    this.filesToUpload = event.target.files;
    this.uploadedNotice =
      this.filesToUpload.length.toString() + " files chosen";
    for (let i = 0; i < this.filesToUpload.length; i++) {
      let reader = new FileReader();
      reader.onerror = err => {
        console.log(err);
      };
      reader.onload = event => {
        let target: any = event.target;
        let result: string = target.result;
        this.metainfo[i] = result.split(",")[1];
      };
      reader.readAsDataURL(this.filesToUpload[i]);
    }
  }

  cancel() {
    this.close.emit(true);
  }

  upload() {
    if (this.metainfo == undefined) {
      this.noFilesChosen = true;
      return;
    }
    if (this.download_dir == undefined || this.download_dir == "") {
      this.download_dir_error = true;
      return;
    }

    for (let i = 0; i < this.metainfo.length; i++) {
      let data = {
        metainfo: this.metainfo[i],
        download_dir: this.download_dir,
        paused: !this.start_when_added
      };
      this.dataService.uploadTorrents(data).subscribe(res => {
        //console.log(res);
      });
    }
    window.localStorage.setItem("lastDownloadDir", this.download_dir);
    this.close.emit(true);
  }

  ngOnInit() {
    this.download_dir = window.localStorage.getItem("lastDownloadDir");
  }
}
