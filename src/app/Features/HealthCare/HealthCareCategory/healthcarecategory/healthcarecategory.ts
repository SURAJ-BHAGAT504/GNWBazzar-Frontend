import { Component, inject } from '@angular/core';
import { Healthcare } from '../../../../Core/Services/healthcare';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-healthcarecategory',
  imports: [CommonModule, FormsModule],
  templateUrl: './healthcarecategory.html',
  styleUrl: './healthcarecategory.css',
})
export class Healthcarecategory {
  healthcare = inject(Healthcare);
  router = inject(Router);

  categories: any[] = [];
  categoryMasters: any[] = [];
  loading = false;

  showPopup = false;

  isEditMode = false;
  editingCategoryId: number | null = null;

  formModel = {
    Category: '',
    CategoryMasterId: 0,
    CreatedOn: new Date()
  };

  ngOnInit() {
    this.fetchCategories();
    this.loadCategoryMasters();
  }

  fetchCategories() {
    this.loading = true;

    this.healthcare.getHealthCareCategories().subscribe({
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
      error: () => this.loading = false
    });
  }

  loadCategoryMasters() {
    this.healthcare.getCategoryMasters().subscribe({
      next: (res) => {
        if (res?.ResponseCode === 200) {
          this.categoryMasters = res?.Value || [];
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getCategoryMasterName(id: number): string {

    const master = this.categoryMasters?.find(m => m.Id === id);

    return master ? master.CategoryName : 'N/A';
  }

  openPopup() {
    this.showPopup = true;
  }

  openUpdatePopup(category: any) {
    this.isEditMode = true;
    this.editingCategoryId = category.Id || category.HealthCareCategoryId; 

    this.formModel = {
      Category: category.Category,
      CategoryMasterId: category.CategoryMasterId,
      CreatedOn: category.CreatedOn
    };

    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.isEditMode = false;
    this.editingCategoryId = null;
    
    this.formModel = {
      Category: '',
      CategoryMasterId: 0,
      CreatedOn: new Date()
    };
  }

  saveCategory(form: any) {
    if (form.invalid) return;

    const payload = {
      Id: this.isEditMode ? this.editingCategoryId : 0, 
      Category: this.formModel.Category,
      CategoryMasterId: Number(this.formModel.CategoryMasterId),
      CreatedOn: this.isEditMode ? this.formModel.CreatedOn : new Date().toISOString()
    };

    if (this.isEditMode && this.editingCategoryId !== null) {
      this.healthcare.updateHealthCareCategory(payload).subscribe({
        next: (res) => {
          if (res?.ResponseCode === 200) {
            this.closePopup();
            this.fetchCategories();
          }
        },
        error: (err) => {
          console.error(err);
          alert(err.error?.Message || "Update failed");
        }
      });
    } else {
      this.healthcare.createHealthCareCategory(payload).subscribe({
        next: (res) => {
          if (res?.ResponseCode === 200) {
            this.closePopup();
            this.fetchCategories();
          }
        },
        error: (err) => {
          console.error(err);
          alert(err.error?.Message || "Creation failed");
        }
      });
    }
  }
}
