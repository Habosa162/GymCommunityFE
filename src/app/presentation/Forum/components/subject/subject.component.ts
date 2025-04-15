import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Sub } from '../../../../domain/models/Forum/sub.model';
import { SubService } from '../../../../services/Forum/sub.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subject',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './subject.component.html',
  styleUrl: './subject.component.css'
})
export class SubjectComponent implements OnInit{
  subs: Sub[] = [];
  subForm: FormGroup;
  isEditMode: boolean = false;
  iscreateMode: boolean = false;
  isListMode: boolean = true;
  currentSubject: Sub | null = null;
  subjectId: number | null = null;

  constructor(
    private subService: SubService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.subForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadSubjects();
    if (this.router.url.includes('create')) {
      this.iscreateMode = true;
      this.isListMode = false;
    }
    this.subjectId = +this.route.snapshot.paramMap.get('id')!;
    if (this.subjectId) {
      this.isEditMode = this.router.url.includes('edit');
      this.loadSubjectDetails();
    }
  }
  loadSubjects(): void {
    this.subService.getAll().subscribe((subjects) => {
      this.subs = subjects;
    });
  }

  loadSubjectDetails(): void {
    this.subService.getById(this.subjectId!).subscribe((subject) => {
      this.currentSubject = subject;
      this.subForm.patchValue({
        name: subject.name,
        description: subject.description
      });
    });
  }

  onSubmit(): void {
    if (this.subForm.invalid) {
      return;
    }

    const sub: Sub = this.subForm.value;
    if (this.isEditMode && this.currentSubject) {
      this.subService.update(this.currentSubject.id, sub).subscribe(() => {
        this.router.navigate(['/subjects']);
      });
    } else {
      this.subService.create(sub).subscribe(() => {
        this.router.navigate(['/subjects']);
      });
    }
  }

  onCreate(): void {
    this.iscreateMode = true;
    this.router.navigate(['/subjects/create']);
  }

  onEdit(id: number): void {
    this.router.navigate([`/subjects/edit/${id}`]);
  }

  onDetails(id: number): void {
    this.router.navigate([`/subjects/details/${id}`]);
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this subject?')) {
      this.subService.delete(id).subscribe(() => {
        this.loadSubjects(); // Refresh the list
      });
    }
  }

  onBack(): void {
    this.router.navigate(['/subjects']);
  }
}
