import { Component, inject } from '@angular/core';
import { Healthcare } from '../../../../Core/Services/healthcare';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categorymaster',
  imports: [CommonModule, FormsModule],
  templateUrl: './categorymaster.html',
  styleUrl: './categorymaster.css',
})
export class Categorymaster {
  healthcare = inject(Healthcare);

  categories: any[] = [];
  loading = false;

  showCreatePopup = false;
  showErrorPopup = false;
  backendErrorMessage = '';

  categoryForm: any = {
    CategoryName: '',
    Description: '',
    IsActive: true,
    CreatedOn: new Date()
  };

  ngOnInit() {
    this.fetchCategories();
  }

  fetchCategories() {
    this.loading = true;

    this.healthcare.getCategoryMasters().subscribe({
      next: (res) => {

        if (res?.ResponseCode === 200) {
          this.categories = res?.Value || [];

          this.categories.sort(
            (a: any, b: any) =>
              new Date(b.CreatedOn).getTime() - new Date(a.CreatedOn).getTime()
          );
        }

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  openCreatePopup() {
    this.showCreatePopup = true;
  }

  closePopup() {
    this.showCreatePopup = false;
  }

  saveCategory(form: any) {

    if (form.invalid) return;

    const payload = {
      CategoryName: this.categoryForm.CategoryName,
      Description: this.categoryForm.Description,
      IsActive: true,
      CreatedOn: new Date()
    };

    this.healthcare.createCategoryMaster(payload).subscribe({
      next: (res) => {

        if (res?.ResponseCode === 200) {
          this.closePopup();
          this.fetchCategories();
        }

      },
      error: (err) => {

        if (err.error?.message) {
          this.backendErrorMessage = err.error.message;
        }
        else {
          this.backendErrorMessage = "Category creation failed";
        }

        this.showErrorPopup = true;
      }
    });
  }
}
