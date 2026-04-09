import { Component, inject } from '@angular/core';
import { Healthcare } from '../../../../Core/Services/HealthCare/healthcare';
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

  searchTerm: string = '';

  showCreatePopup = false;
  showErrorPopup = false;
  backendErrorMessage = '';

  isEditMode = false;
  editingCategoryId: number | null = null;

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

  get filteredCategories() {
  if (!this.searchTerm || !this.searchTerm.trim()) {
    return this.categories;
  }

  const term = this.searchTerm.toLowerCase();

  return this.categories.filter(c => {
    const name = (c.CategoryName || '').toLowerCase();
    const desc = (c.Description || '').toLowerCase();
    
    return name.includes(term) || desc.includes(term);
  });
}

  openCreatePopup() {
    this.showCreatePopup = true;
  }

  openUpdatePopup(category: any) {
    this.isEditMode = true;
    this.editingCategoryId = category.Id || category.CategoryId; 
    
    this.categoryForm = {
      CategoryName: category.CategoryName,
      Description: category.Description,
      IsActive: category.IsActive,
      CreatedOn: category.CreatedOn
    };
    
    this.showCreatePopup = true;
  }

  closePopup() {
    this.showCreatePopup = false;
    this.isEditMode = false;
    this.editingCategoryId = null;
    this.categoryForm = {
      CategoryName: '',
      Description: '',
      IsActive: true,
      CreatedOn: new Date()
    };
  }

  saveCategory(form: any) {
    if (form.invalid) return;

    const payload = {
    Id: this.isEditMode ? this.editingCategoryId : 0,
    CategoryName: this.categoryForm.CategoryName,
    Description: this.categoryForm.Description,
    IsActive: this.categoryForm.IsActive,
    CreatedOn: this.isEditMode ? this.categoryForm.CreatedOn : new Date()
  };

    if (this.isEditMode && this.editingCategoryId !== null) {
      this.healthcare.updateCategoryMaster(payload).subscribe({
        next: (res) => {
          if (res?.ResponseCode === 200) {
            this.closePopup();
            this.fetchCategories();
          }
        },
        error: (err) => this.handleError(err, "Category update failed")
      });
    } else {
      this.healthcare.createCategoryMaster(payload).subscribe({
        next: (res) => {
          if (res?.ResponseCode === 200) {
            this.closePopup();
            this.fetchCategories();
          }
        },
        error: (err) => this.handleError(err, "Category creation failed")
      });
    }
  }

  handleError(err: any, defaultMessage: string) {
    if (err.error?.message) {
      this.backendErrorMessage = err.error.message;
    } else {
      this.backendErrorMessage = defaultMessage;
    }
    this.showErrorPopup = true;
  }
}