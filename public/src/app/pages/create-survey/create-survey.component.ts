import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { Survey, Question, Option } from './data-models';
export interface QuestionType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-create-survey',
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.css']
})
export class CreateSurveyComponent implements OnInit {
  surveyForm: FormGroup;

  selectedOption = [];

  editMode = false;
  surveyTypes = [
    { id: 0, value: 'Training' },
    { id: 1, value: 'HR' }
  ];


  questions: QuestionType[] = [
    { value: 'Single choice', viewValue: 'Single choice' },
    { value: 'Multi choice', viewValue: 'Multi choice' },
    { value: 'Text', viewValue: 'Text' }
  ];


  constructor(
    // private surveyService: SurveyService,

  ) { }

  ngOnInit() {
    this.initForm();

  }

  private initForm() {
    const surveyTitle = '';
    const surveyType = '';
    const surveyQuestions = new FormArray([]);

    this.surveyForm = new FormGroup({
      surveyTitle: new FormControl(surveyTitle, [Validators.required]),
      surveyType: new FormControl(surveyType, [Validators.required]),
      surveyQuestions: new FormArray([]),
      IsAnonymous: new FormControl(false, [Validators.required])
    });
    this.onAddQuestion();
  }


  get getFormControls() {
    const control = this.surveyForm.get('surveyQuestions') as FormArray;
    return control;
  }

  // convenience getter for easy access to form fields
  get formControls() {
    return this.surveyForm.controls;
  }


  onAddQuestion() {
    console.log(this.surveyForm);
    const surveyQuestionItem = new FormGroup({
      questionTitle: new FormControl('', Validators.required),
      questionType: new FormControl('', Validators.required),
      questionGroup: new FormGroup({})
    });

    (this.surveyForm.get('surveyQuestions') as FormArray).push(surveyQuestionItem);

  }

  onRemoveQuestion(index: number) {
    const control = this.surveyForm.get('surveyQuestions') as FormArray;
    control.removeAt(index);
    this.selectedOption.splice(index, 1);
    console.log(this.surveyForm);
  }

  onRemoveQuestionOld(index) {
    this.surveyForm.controls.surveyQuestions[index].controls.questionGroup = new FormGroup({});
    this.surveyForm.controls.surveyQuestions[index].controls.questionType = new FormControl({});
    (this.surveyForm.get('surveyQuestions') as FormArray).removeAt(index);
    this.selectedOption.splice(index, 1);
    console.log(this.surveyForm);
  }


  onSeletQuestionType(questionType, index) {
    if (questionType === 'Single choice' || questionType === 'Multi choice') {
      this.addOptionControls(questionType, index);
    }
  }

  addOptionControls(questionType, index) {
    const options = new FormArray([]);
    const showRemarksBox = new FormControl(false);

    const control = this.surveyForm.get('surveyQuestions') as FormArray;

    (this.surveyForm.controls.surveyQuestions['controls'][index].controls.questionGroup).addControl('options', options);
    (this.surveyForm.controls.surveyQuestions['controls'][index].controls.questionGroup).addControl('showRemarksBox', showRemarksBox);

    this.clearFormArray((<FormArray>this.surveyForm.controls.surveyQuestions['controls'][index].controls.questionGroup.controls.options));

    this.addOption(index);
    this.addOption(index);
  }


  private clearFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }


  addOption(index) {
    const optionGroup = new FormGroup({
      'optionText': new FormControl('', Validators.required),
    });
    (<FormArray>this.surveyForm.controls.surveyQuestions['controls'][index].controls.questionGroup.controls.options).push(optionGroup);
  }

  removeOption(questionIndex, itemIndex) {
    (<FormArray>this.surveyForm.controls.surveyQuestions['controls'][questionIndex].controls.questionGroup.controls.options).removeAt(itemIndex);
  }







  postSurvey() {

    const formData = this.surveyForm.value;
    console.log(formData);

    console.log();
    const ID = 0;
    const Type = formData.surveyType;
    const Title = formData.surveyTitle;
    const IsDeleted = false;
    const IsAnonymous = formData.IsAnonymous;
    //  let Question: Question[] = [];
    const Questions = [];

    const surveyQuestions = formData.surveyQuestions;
    const optionArray = formData.surveyQuestions[0].questionGroup.options[0].optionText;
    const survey = new Survey(ID, Type, Title, IsDeleted, IsAnonymous, Questions);


    surveyQuestions.forEach((question, index, array) => {


      const questionItem = {
        ID: 0,
        'Type': question.questionType,
        'Text': question.questionTitle,
        'options': [],
        'Required': false,
        'Remarks': '',
        'hasRemarks': false

      };
      if (question.questionGroup.hasOwnProperty('showRemarksBox')) {
        questionItem.hasRemarks = question.questionGroup.showRemarksBox;
      }


      if (question.questionGroup.hasOwnProperty('options')) {



        question.questionGroup.options.forEach(option => {
          const optionItem: Option = {
            'ID': 0,
            'OptionText': option.optionText,
            'OptionColor': '',
            'hasRemarks': false

          };
          questionItem.options.push(optionItem);
        });
      }


      survey.Question.push(questionItem);


    });


    console.log(survey);
    console.log('posting survey');


  }


  onSubmit() {

    this.postSurvey();

  }






}
