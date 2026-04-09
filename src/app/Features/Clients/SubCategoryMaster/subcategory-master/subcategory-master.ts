import { Component, inject, OnInit } from '@angular/core';
import { Subcategorymaster } from '../../../../Core/Services/SubCategoryMaster/subcategorymaster';
import { Healthcare } from '../../../../Core/Services/HealthCare/healthcare';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subcategory-master',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subcategory-master.html',
  styleUrl: './subcategory-master.css',
})
export class SubcategoryMaster implements OnInit {
  subCategoryService = inject(Subcategorymaster);
  healthCare = inject(Healthcare);

  subCategories: any[] = [];
  categoryMasters: any[] = []; // Matches the Healthcarecategory concept
  loading = false;
  searchTerm: string = '';

  showCreatePopup = false;
  showErrorPopup = false;
  backendErrorMessage: string = '';

  isEditMode = false;
  editingSubCategoryId: number | null = null;

  // Form model structure matching your C# Entity
  subCategoryForm = {
    CategoryName: '',
    CategoryMasterId: 0,
    CreatedOn: new Date()
  };

  ngOnInit() {
    this.fetchSubCategories();
    this.loadCategoryMasters();
  }

  fetchSubCategories() {
    this.loading = true;
    this.subCategoryService.getSubCategoryMaster().subscribe({
      next: (res: any) => {
        if (res?.ResponseCode === 200) {
          // Force a new array reference and sort by Newest first
          const data = [...(res?.Value || [])];
          this.subCategories = data.sort((a, b) =>
            new Date(b.CreatedOn).getTime() - new Date(a.CreatedOn).getTime()
          );
        }
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  loadCategoryMasters() {
    this.healthCare.getCategoryMasters().subscribe({
      next: (res: any) => {
        if (res?.ResponseCode === 200) {
          this.categoryMasters = res?.Value || [];
        }
      }
    });
  }

  // Matches getCategoryMasterName concept
  getParentCategoryName(id: number): string {
    const master = this.categoryMasters?.find(m => m.Id === id);
    return master ? master.CategoryName : 'N/A';
  }

  // UPDATED FILTER: Uses 'CategoryName' to match your C# Entity
  get filteredSubCategories() {
    if (!this.searchTerm || !this.searchTerm.trim()) {
      return this.subCategories;
    }

    const term = this.searchTerm.toLowerCase();

    return this.subCategories.filter(s => {
      // Use 'CategoryName' as defined in your C# class
      const subName = (s.CategoryName || '').toLowerCase();
      const parentName = this.getParentCategoryName(s.CategoryMasterId).toLowerCase();

      return subName.includes(term) || parentName.includes(term);
    });
  }

  openCreatePopup() {
    this.isEditMode = false;
    this.resetForm();
    this.showCreatePopup = true;
  }

  openUpdatePopup(sub: any) {
    this.isEditMode = true;
    this.editingSubCategoryId = sub.Id;

    this.subCategoryForm = {
      CategoryName: sub.CategoryName,
      CategoryMasterId: sub.CategoryMasterId,
      CreatedOn: sub.CreatedOn
    };

    this.showCreatePopup = true;
  }

  closePopup() {
    this.showCreatePopup = false;
    this.isEditMode = false;
    this.editingSubCategoryId = null;
    this.resetForm();
  }

  resetForm() {
    this.subCategoryForm = { 
      CategoryName: '', 
      CategoryMasterId: 0, 
      CreatedOn: new Date() 
    };
  }

  saveSubCategory(form: any) {
    if (form.invalid) return;

    const payload = {
      Id: this.isEditMode ? this.editingSubCategoryId : 0,
      CategoryName: this.subCategoryForm.CategoryName,
      CategoryMasterId: Number(this.subCategoryForm.CategoryMasterId),
      CreatedOn: this.isEditMode ? this.subCategoryForm.CreatedOn : new Date().toISOString()
    };

    const request = this.isEditMode
      ? this.subCategoryService.updateSubCategoryMaster(payload)
      : this.subCategoryService.createSubCategoryMaster(payload);

    request.subscribe({
      next: (res: any) => {
        if (res?.ResponseCode === 200) {
          this.closePopup();
          this.fetchSubCategories();
        } else {
          this.handleError(null, res?.Message || "Operation failed");
        }
      },
      error: (err) => this.handleError(err, "Sub-Category operation failed")
    });
  }

  handleError(err: any, defaultMessage: string) {
    this.backendErrorMessage = err?.error?.Message || err?.error?.message || defaultMessage;
    this.showErrorPopup = true;
  }
}