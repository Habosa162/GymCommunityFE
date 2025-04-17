import "./chunk-OIBNGD5S.js";
import {
  CdkPortalOutlet,
  PortalModule,
  TemplatePortal
} from "./chunk-GAWFJTQX.js";
import {
  ErrorStateMatcher
} from "./chunk-2KXCDQW6.js";
import {
  DomSanitizer
} from "./chunk-VORCGGNX.js";
import {
  HttpClient
} from "./chunk-7MBRY2QE.js";
import {
  MatRipple,
  MatRippleModule,
  _StructuralStylesLoader
} from "./chunk-TPVZ25RS.js";
import {
  ENTER,
  FocusKeyManager,
  FocusMonitor,
  MatCommonModule,
  SPACE,
  _IdGenerator,
  _VisuallyHiddenLoader,
  _getFocusedElementPierceShadowDom,
  hasModifierKey
} from "./chunk-2NE43QZO.js";
import "./chunk-M3HR6BUY.js";
import "./chunk-LLSYBTIE.js";
import {
  BidiModule,
  Directionality
} from "./chunk-GOSVRJIQ.js";
import {
  _CdkPrivateStyleLoader
} from "./chunk-VC3ERYFJ.js";
import {
  Platform
} from "./chunk-TBPBL5EG.js";
import {
  ControlContainer
} from "./chunk-4YTDOO3E.js";
import {
  NgTemplateOutlet
} from "./chunk-67Q4LKMM.js";
import {
  DOCUMENT
} from "./chunk-DITTXYZP.js";
import {
  ANIMATION_MODULE_TYPE,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  ErrorHandler,
  EventEmitter,
  HostAttributeToken,
  Inject,
  Injectable,
  InjectionToken,
  Input,
  NgModule,
  NgZone,
  Optional,
  Output,
  QueryList,
  Renderer2,
  SecurityContext,
  SkipSelf,
  Subject,
  Subscription,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  ViewEncapsulation,
  booleanAttribute,
  catchError,
  finalize,
  forkJoin,
  inject,
  map,
  numberAttribute,
  of,
  setClassMetadata,
  share,
  signal,
  startWith,
  switchMap,
  take,
  takeUntil,
  tap,
  throwError,
  ɵɵInheritDefinitionFeature,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassMapInterpolate1,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵcontentQuery,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵhostProperty,
  ɵɵinject,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵpureFunction2,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵviewQuery
} from "./chunk-EFOSVCYK.js";

// node_modules/@angular/cdk/fesm2022/stepper.mjs
var _c0 = ["*"];
function CdkStep_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0);
  }
}
var CdkStepHeader = class _CdkStepHeader {
  _elementRef = inject(ElementRef);
  constructor() {
  }
  /** Focuses the step header. */
  focus() {
    this._elementRef.nativeElement.focus();
  }
  static ɵfac = function CdkStepHeader_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkStepHeader)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _CdkStepHeader,
    selectors: [["", "cdkStepHeader", ""]],
    hostAttrs: ["role", "tab"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkStepHeader, [{
    type: Directive,
    args: [{
      selector: "[cdkStepHeader]",
      host: {
        "role": "tab"
      }
    }]
  }], () => [], null);
})();
var CdkStepLabel = class _CdkStepLabel {
  template = inject(TemplateRef);
  constructor() {
  }
  static ɵfac = function CdkStepLabel_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkStepLabel)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _CdkStepLabel,
    selectors: [["", "cdkStepLabel", ""]]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkStepLabel, [{
    type: Directive,
    args: [{
      selector: "[cdkStepLabel]"
    }]
  }], () => [], null);
})();
var STEP_STATE = {
  NUMBER: "number",
  EDIT: "edit",
  DONE: "done",
  ERROR: "error"
};
var STEPPER_GLOBAL_OPTIONS = new InjectionToken("STEPPER_GLOBAL_OPTIONS");
var CdkStep = class _CdkStep {
  _stepperOptions;
  _stepper = inject(CdkStepper);
  _displayDefaultIndicatorType;
  /** Template for step label if it exists. */
  stepLabel;
  /** Forms that have been projected into the step. */
  _childForms;
  /** Template for step content. */
  content;
  /** The top level abstract control of the step. */
  stepControl;
  /** Whether user has attempted to move away from the step. */
  interacted = false;
  /** Emits when the user has attempted to move away from the step. */
  interactedStream = new EventEmitter();
  /** Plain text label of the step. */
  label;
  /** Error message to display when there's an error. */
  errorMessage;
  /** Aria label for the tab. */
  ariaLabel;
  /**
   * Reference to the element that the tab is labelled by.
   * Will be cleared if `aria-label` is set at the same time.
   */
  ariaLabelledby;
  /** State of the step. */
  state;
  /** Whether the user can return to this step once it has been marked as completed. */
  editable = true;
  /** Whether the completion of step is optional. */
  optional = false;
  /** Whether step is marked as completed. */
  get completed() {
    return this._completedOverride == null ? this._getDefaultCompleted() : this._completedOverride;
  }
  set completed(value) {
    this._completedOverride = value;
  }
  _completedOverride = null;
  _getDefaultCompleted() {
    return this.stepControl ? this.stepControl.valid && this.interacted : this.interacted;
  }
  /** Whether step has an error. */
  get hasError() {
    return this._customError == null ? this._getDefaultError() : this._customError;
  }
  set hasError(value) {
    this._customError = value;
  }
  _customError = null;
  _getDefaultError() {
    return this.stepControl && this.stepControl.invalid && this.interacted;
  }
  constructor() {
    const stepperOptions = inject(STEPPER_GLOBAL_OPTIONS, {
      optional: true
    });
    this._stepperOptions = stepperOptions ? stepperOptions : {};
    this._displayDefaultIndicatorType = this._stepperOptions.displayDefaultIndicatorType !== false;
  }
  /** Selects this step component. */
  select() {
    this._stepper.selected = this;
  }
  /** Resets the step to its initial state. Note that this includes resetting form data. */
  reset() {
    this.interacted = false;
    if (this._completedOverride != null) {
      this._completedOverride = false;
    }
    if (this._customError != null) {
      this._customError = false;
    }
    if (this.stepControl) {
      this._childForms?.forEach((form) => form.resetForm?.());
      this.stepControl.reset();
    }
  }
  ngOnChanges() {
    this._stepper._stateChanged();
  }
  _markAsInteracted() {
    if (!this.interacted) {
      this.interacted = true;
      this.interactedStream.emit(this);
    }
  }
  /** Determines whether the error state can be shown. */
  _showError() {
    return this._stepperOptions.showError ?? this._customError != null;
  }
  static ɵfac = function CdkStep_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkStep)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _CdkStep,
    selectors: [["cdk-step"]],
    contentQueries: function CdkStep_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuery(dirIndex, CdkStepLabel, 5);
        ɵɵcontentQuery(
          dirIndex,
          // Note: we look for `ControlContainer` here, because both `NgForm` and `FormGroupDirective`
          // provides themselves as such, but we don't want to have a concrete reference to both of
          // the directives. The type is marked as `Partial` in case we run into a class that provides
          // itself as `ControlContainer` but doesn't have the same interface as the directives.
          ControlContainer,
          5
        );
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.stepLabel = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx._childForms = _t);
      }
    },
    viewQuery: function CdkStep_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuery(TemplateRef, 7);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.content = _t.first);
      }
    },
    inputs: {
      stepControl: "stepControl",
      label: "label",
      errorMessage: "errorMessage",
      ariaLabel: [0, "aria-label", "ariaLabel"],
      ariaLabelledby: [0, "aria-labelledby", "ariaLabelledby"],
      state: "state",
      editable: [2, "editable", "editable", booleanAttribute],
      optional: [2, "optional", "optional", booleanAttribute],
      completed: [2, "completed", "completed", booleanAttribute],
      hasError: [2, "hasError", "hasError", booleanAttribute]
    },
    outputs: {
      interactedStream: "interacted"
    },
    exportAs: ["cdkStep"],
    features: [ɵɵNgOnChangesFeature],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function CdkStep_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵtemplate(0, CdkStep_ng_template_0_Template, 1, 0, "ng-template");
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkStep, [{
    type: Component,
    args: [{
      selector: "cdk-step",
      exportAs: "cdkStep",
      template: "<ng-template><ng-content/></ng-template>",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], () => [], {
    stepLabel: [{
      type: ContentChild,
      args: [CdkStepLabel]
    }],
    _childForms: [{
      type: ContentChildren,
      args: [
        // Note: we look for `ControlContainer` here, because both `NgForm` and `FormGroupDirective`
        // provides themselves as such, but we don't want to have a concrete reference to both of
        // the directives. The type is marked as `Partial` in case we run into a class that provides
        // itself as `ControlContainer` but doesn't have the same interface as the directives.
        ControlContainer,
        {
          descendants: true
        }
      ]
    }],
    content: [{
      type: ViewChild,
      args: [TemplateRef, {
        static: true
      }]
    }],
    stepControl: [{
      type: Input
    }],
    interactedStream: [{
      type: Output,
      args: ["interacted"]
    }],
    label: [{
      type: Input
    }],
    errorMessage: [{
      type: Input
    }],
    ariaLabel: [{
      type: Input,
      args: ["aria-label"]
    }],
    ariaLabelledby: [{
      type: Input,
      args: ["aria-labelledby"]
    }],
    state: [{
      type: Input
    }],
    editable: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    optional: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    completed: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    hasError: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }]
  });
})();
var CdkStepper = class _CdkStepper {
  _dir = inject(Directionality, {
    optional: true
  });
  _changeDetectorRef = inject(ChangeDetectorRef);
  _elementRef = inject(ElementRef);
  /** Emits when the component is destroyed. */
  _destroyed = new Subject();
  /** Used for managing keyboard focus. */
  _keyManager;
  /** Full list of steps inside the stepper, including inside nested steppers. */
  _steps;
  /** Steps that belong to the current stepper, excluding ones from nested steppers. */
  steps = new QueryList();
  /** The list of step headers of the steps in the stepper. */
  _stepHeader;
  /** List of step headers sorted based on their DOM order. */
  _sortedHeaders = new QueryList();
  /** Whether the validity of previous steps should be checked or not. */
  linear = false;
  /** The index of the selected step. */
  get selectedIndex() {
    return this._selectedIndex;
  }
  set selectedIndex(index) {
    if (this._steps) {
      if (!this._isValidIndex(index) && (typeof ngDevMode === "undefined" || ngDevMode)) {
        throw Error("cdkStepper: Cannot assign out-of-bounds value to `selectedIndex`.");
      }
      if (this._selectedIndex !== index) {
        this.selected?._markAsInteracted();
        if (!this._anyControlsInvalidOrPending(index) && (index >= this._selectedIndex || this.steps.toArray()[index].editable)) {
          this._updateSelectedItemIndex(index);
        }
      }
    } else {
      this._selectedIndex = index;
    }
  }
  _selectedIndex = 0;
  /** The step that is selected. */
  get selected() {
    return this.steps ? this.steps.toArray()[this.selectedIndex] : void 0;
  }
  set selected(step) {
    this.selectedIndex = step && this.steps ? this.steps.toArray().indexOf(step) : -1;
  }
  /** Event emitted when the selected step has changed. */
  selectionChange = new EventEmitter();
  /** Output to support two-way binding on `[(selectedIndex)]` */
  selectedIndexChange = new EventEmitter();
  /** Used to track unique ID for each stepper component. */
  _groupId = inject(_IdGenerator).getId("cdk-stepper-");
  /** Orientation of the stepper. */
  get orientation() {
    return this._orientation;
  }
  set orientation(value) {
    this._orientation = value;
    if (this._keyManager) {
      this._keyManager.withVerticalOrientation(value === "vertical");
    }
  }
  _orientation = "horizontal";
  constructor() {
  }
  ngAfterContentInit() {
    this._steps.changes.pipe(startWith(this._steps), takeUntil(this._destroyed)).subscribe((steps) => {
      this.steps.reset(steps.filter((step) => step._stepper === this));
      this.steps.notifyOnChanges();
    });
  }
  ngAfterViewInit() {
    this._stepHeader.changes.pipe(startWith(this._stepHeader), takeUntil(this._destroyed)).subscribe((headers) => {
      this._sortedHeaders.reset(headers.toArray().sort((a, b) => {
        const documentPosition = a._elementRef.nativeElement.compareDocumentPosition(b._elementRef.nativeElement);
        return documentPosition & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
      }));
      this._sortedHeaders.notifyOnChanges();
    });
    this._keyManager = new FocusKeyManager(this._sortedHeaders).withWrap().withHomeAndEnd().withVerticalOrientation(this._orientation === "vertical");
    (this._dir ? this._dir.change : of()).pipe(startWith(this._layoutDirection()), takeUntil(this._destroyed)).subscribe((direction) => this._keyManager.withHorizontalOrientation(direction));
    this._keyManager.updateActiveItem(this._selectedIndex);
    this.steps.changes.subscribe(() => {
      if (!this.selected) {
        this._selectedIndex = Math.max(this._selectedIndex - 1, 0);
      }
    });
    if (!this._isValidIndex(this._selectedIndex)) {
      this._selectedIndex = 0;
    }
    if (this.linear && this._selectedIndex > 0) {
      const visitedSteps = this.steps.toArray().slice(0, this._selectedIndex);
      for (const step of visitedSteps) {
        step._markAsInteracted();
      }
    }
  }
  ngOnDestroy() {
    this._keyManager?.destroy();
    this.steps.destroy();
    this._sortedHeaders.destroy();
    this._destroyed.next();
    this._destroyed.complete();
  }
  /** Selects and focuses the next step in list. */
  next() {
    this.selectedIndex = Math.min(this._selectedIndex + 1, this.steps.length - 1);
  }
  /** Selects and focuses the previous step in list. */
  previous() {
    this.selectedIndex = Math.max(this._selectedIndex - 1, 0);
  }
  /** Resets the stepper to its initial state. Note that this includes clearing form data. */
  reset() {
    this._updateSelectedItemIndex(0);
    this.steps.forEach((step) => step.reset());
    this._stateChanged();
  }
  /** Returns a unique id for each step label element. */
  _getStepLabelId(i) {
    return `${this._groupId}-label-${i}`;
  }
  /** Returns unique id for each step content element. */
  _getStepContentId(i) {
    return `${this._groupId}-content-${i}`;
  }
  /** Marks the component to be change detected. */
  _stateChanged() {
    this._changeDetectorRef.markForCheck();
  }
  /** Returns position state of the step with the given index. */
  _getAnimationDirection(index) {
    const position = index - this._selectedIndex;
    if (position < 0) {
      return this._layoutDirection() === "rtl" ? "next" : "previous";
    } else if (position > 0) {
      return this._layoutDirection() === "rtl" ? "previous" : "next";
    }
    return "current";
  }
  /** Returns the type of icon to be displayed. */
  _getIndicatorType(index, state = STEP_STATE.NUMBER) {
    const step = this.steps.toArray()[index];
    const isCurrentStep = this._isCurrentStep(index);
    return step._displayDefaultIndicatorType ? this._getDefaultIndicatorLogic(step, isCurrentStep) : this._getGuidelineLogic(step, isCurrentStep, state);
  }
  _getDefaultIndicatorLogic(step, isCurrentStep) {
    if (step._showError() && step.hasError && !isCurrentStep) {
      return STEP_STATE.ERROR;
    } else if (!step.completed || isCurrentStep) {
      return STEP_STATE.NUMBER;
    } else {
      return step.editable ? STEP_STATE.EDIT : STEP_STATE.DONE;
    }
  }
  _getGuidelineLogic(step, isCurrentStep, state = STEP_STATE.NUMBER) {
    if (step._showError() && step.hasError && !isCurrentStep) {
      return STEP_STATE.ERROR;
    } else if (step.completed && !isCurrentStep) {
      return STEP_STATE.DONE;
    } else if (step.completed && isCurrentStep) {
      return state;
    } else if (step.editable && isCurrentStep) {
      return STEP_STATE.EDIT;
    } else {
      return state;
    }
  }
  _isCurrentStep(index) {
    return this._selectedIndex === index;
  }
  /** Returns the index of the currently-focused step header. */
  _getFocusIndex() {
    return this._keyManager ? this._keyManager.activeItemIndex : this._selectedIndex;
  }
  _updateSelectedItemIndex(newIndex) {
    const stepsArray = this.steps.toArray();
    this.selectionChange.emit({
      selectedIndex: newIndex,
      previouslySelectedIndex: this._selectedIndex,
      selectedStep: stepsArray[newIndex],
      previouslySelectedStep: stepsArray[this._selectedIndex]
    });
    this._containsFocus() ? this._keyManager.setActiveItem(newIndex) : this._keyManager.updateActiveItem(newIndex);
    this._selectedIndex = newIndex;
    this.selectedIndexChange.emit(this._selectedIndex);
    this._stateChanged();
  }
  _onKeydown(event) {
    const hasModifier = hasModifierKey(event);
    const keyCode = event.keyCode;
    const manager = this._keyManager;
    if (manager.activeItemIndex != null && !hasModifier && (keyCode === SPACE || keyCode === ENTER)) {
      this.selectedIndex = manager.activeItemIndex;
      event.preventDefault();
    } else {
      manager.setFocusOrigin("keyboard").onKeydown(event);
    }
  }
  _anyControlsInvalidOrPending(index) {
    if (this.linear && index >= 0) {
      return this.steps.toArray().slice(0, index).some((step) => {
        const control = step.stepControl;
        const isIncomplete = control ? control.invalid || control.pending || !step.interacted : !step.completed;
        return isIncomplete && !step.optional && !step._completedOverride;
      });
    }
    return false;
  }
  _layoutDirection() {
    return this._dir && this._dir.value === "rtl" ? "rtl" : "ltr";
  }
  /** Checks whether the stepper contains the focused element. */
  _containsFocus() {
    const stepperElement = this._elementRef.nativeElement;
    const focusedElement = _getFocusedElementPierceShadowDom();
    return stepperElement === focusedElement || stepperElement.contains(focusedElement);
  }
  /** Checks whether the passed-in index is a valid step index. */
  _isValidIndex(index) {
    return index > -1 && (!this.steps || index < this.steps.length);
  }
  static ɵfac = function CdkStepper_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkStepper)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _CdkStepper,
    selectors: [["", "cdkStepper", ""]],
    contentQueries: function CdkStepper_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuery(dirIndex, CdkStep, 5);
        ɵɵcontentQuery(dirIndex, CdkStepHeader, 5);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx._steps = _t);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx._stepHeader = _t);
      }
    },
    inputs: {
      linear: [2, "linear", "linear", booleanAttribute],
      selectedIndex: [2, "selectedIndex", "selectedIndex", numberAttribute],
      selected: "selected",
      orientation: "orientation"
    },
    outputs: {
      selectionChange: "selectionChange",
      selectedIndexChange: "selectedIndexChange"
    },
    exportAs: ["cdkStepper"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkStepper, [{
    type: Directive,
    args: [{
      selector: "[cdkStepper]",
      exportAs: "cdkStepper"
    }]
  }], () => [], {
    _steps: [{
      type: ContentChildren,
      args: [CdkStep, {
        descendants: true
      }]
    }],
    _stepHeader: [{
      type: ContentChildren,
      args: [CdkStepHeader, {
        descendants: true
      }]
    }],
    linear: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    selectedIndex: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    selected: [{
      type: Input
    }],
    selectionChange: [{
      type: Output
    }],
    selectedIndexChange: [{
      type: Output
    }],
    orientation: [{
      type: Input
    }]
  });
})();
var CdkStepperNext = class _CdkStepperNext {
  _stepper = inject(CdkStepper);
  /** Type of the next button. Defaults to "submit" if not specified. */
  type = "submit";
  constructor() {
  }
  static ɵfac = function CdkStepperNext_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkStepperNext)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _CdkStepperNext,
    selectors: [["button", "cdkStepperNext", ""]],
    hostVars: 1,
    hostBindings: function CdkStepperNext_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("click", function CdkStepperNext_click_HostBindingHandler() {
          return ctx._stepper.next();
        });
      }
      if (rf & 2) {
        ɵɵhostProperty("type", ctx.type);
      }
    },
    inputs: {
      type: "type"
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkStepperNext, [{
    type: Directive,
    args: [{
      selector: "button[cdkStepperNext]",
      host: {
        "[type]": "type",
        "(click)": "_stepper.next()"
      }
    }]
  }], () => [], {
    type: [{
      type: Input
    }]
  });
})();
var CdkStepperPrevious = class _CdkStepperPrevious {
  _stepper = inject(CdkStepper);
  /** Type of the previous button. Defaults to "button" if not specified. */
  type = "button";
  constructor() {
  }
  static ɵfac = function CdkStepperPrevious_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkStepperPrevious)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _CdkStepperPrevious,
    selectors: [["button", "cdkStepperPrevious", ""]],
    hostVars: 1,
    hostBindings: function CdkStepperPrevious_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("click", function CdkStepperPrevious_click_HostBindingHandler() {
          return ctx._stepper.previous();
        });
      }
      if (rf & 2) {
        ɵɵhostProperty("type", ctx.type);
      }
    },
    inputs: {
      type: "type"
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkStepperPrevious, [{
    type: Directive,
    args: [{
      selector: "button[cdkStepperPrevious]",
      host: {
        "[type]": "type",
        "(click)": "_stepper.previous()"
      }
    }]
  }], () => [], {
    type: [{
      type: Input
    }]
  });
})();
var CdkStepperModule = class _CdkStepperModule {
  static ɵfac = function CdkStepperModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkStepperModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _CdkStepperModule,
    imports: [BidiModule, CdkStep, CdkStepper, CdkStepHeader, CdkStepLabel, CdkStepperNext, CdkStepperPrevious],
    exports: [CdkStep, CdkStepper, CdkStepHeader, CdkStepLabel, CdkStepperNext, CdkStepperPrevious]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [BidiModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkStepperModule, [{
    type: NgModule,
    args: [{
      imports: [BidiModule, CdkStep, CdkStepper, CdkStepHeader, CdkStepLabel, CdkStepperNext, CdkStepperPrevious],
      exports: [CdkStep, CdkStepper, CdkStepHeader, CdkStepLabel, CdkStepperNext, CdkStepperPrevious]
    }]
  }], null, null);
})();

// node_modules/@angular/material/fesm2022/icon-registry-75ed3f35.mjs
var policy;
function getPolicy() {
  if (policy === void 0) {
    policy = null;
    if (typeof window !== "undefined") {
      const ttWindow = window;
      if (ttWindow.trustedTypes !== void 0) {
        policy = ttWindow.trustedTypes.createPolicy("angular#components", {
          createHTML: (s) => s
        });
      }
    }
  }
  return policy;
}
function trustedHTMLFromString(html) {
  return getPolicy()?.createHTML(html) || html;
}
function getMatIconNameNotFoundError(iconName) {
  return Error(`Unable to find icon with the name "${iconName}"`);
}
function getMatIconNoHttpProviderError() {
  return Error("Could not find HttpClient for use with Angular Material icons. Please add provideHttpClient() to your providers.");
}
function getMatIconFailedToSanitizeUrlError(url) {
  return Error(`The URL provided to MatIconRegistry was not trusted as a resource URL via Angular's DomSanitizer. Attempted URL was "${url}".`);
}
function getMatIconFailedToSanitizeLiteralError(literal) {
  return Error(`The literal provided to MatIconRegistry was not trusted as safe HTML by Angular's DomSanitizer. Attempted literal was "${literal}".`);
}
var SvgIconConfig = class {
  url;
  svgText;
  options;
  svgElement;
  constructor(url, svgText, options) {
    this.url = url;
    this.svgText = svgText;
    this.options = options;
  }
};
var MatIconRegistry = class _MatIconRegistry {
  _httpClient;
  _sanitizer;
  _errorHandler;
  _document;
  /**
   * URLs and cached SVG elements for individual icons. Keys are of the format "[namespace]:[icon]".
   */
  _svgIconConfigs = /* @__PURE__ */ new Map();
  /**
   * SvgIconConfig objects and cached SVG elements for icon sets, keyed by namespace.
   * Multiple icon sets can be registered under the same namespace.
   */
  _iconSetConfigs = /* @__PURE__ */ new Map();
  /** Cache for icons loaded by direct URLs. */
  _cachedIconsByUrl = /* @__PURE__ */ new Map();
  /** In-progress icon fetches. Used to coalesce multiple requests to the same URL. */
  _inProgressUrlFetches = /* @__PURE__ */ new Map();
  /** Map from font identifiers to their CSS class names. Used for icon fonts. */
  _fontCssClassesByAlias = /* @__PURE__ */ new Map();
  /** Registered icon resolver functions. */
  _resolvers = [];
  /**
   * The CSS classes to apply when an `<mat-icon>` component has no icon name, url, or font
   * specified. The default 'material-icons' value assumes that the material icon font has been
   * loaded as described at https://google.github.io/material-design-icons/#icon-font-for-the-web
   */
  _defaultFontSetClass = ["material-icons", "mat-ligature-font"];
  constructor(_httpClient, _sanitizer, document, _errorHandler) {
    this._httpClient = _httpClient;
    this._sanitizer = _sanitizer;
    this._errorHandler = _errorHandler;
    this._document = document;
  }
  /**
   * Registers an icon by URL in the default namespace.
   * @param iconName Name under which the icon should be registered.
   * @param url
   */
  addSvgIcon(iconName, url, options) {
    return this.addSvgIconInNamespace("", iconName, url, options);
  }
  /**
   * Registers an icon using an HTML string in the default namespace.
   * @param iconName Name under which the icon should be registered.
   * @param literal SVG source of the icon.
   */
  addSvgIconLiteral(iconName, literal, options) {
    return this.addSvgIconLiteralInNamespace("", iconName, literal, options);
  }
  /**
   * Registers an icon by URL in the specified namespace.
   * @param namespace Namespace in which the icon should be registered.
   * @param iconName Name under which the icon should be registered.
   * @param url
   */
  addSvgIconInNamespace(namespace, iconName, url, options) {
    return this._addSvgIconConfig(namespace, iconName, new SvgIconConfig(url, null, options));
  }
  /**
   * Registers an icon resolver function with the registry. The function will be invoked with the
   * name and namespace of an icon when the registry tries to resolve the URL from which to fetch
   * the icon. The resolver is expected to return a `SafeResourceUrl` that points to the icon,
   * an object with the icon URL and icon options, or `null` if the icon is not supported. Resolvers
   * will be invoked in the order in which they have been registered.
   * @param resolver Resolver function to be registered.
   */
  addSvgIconResolver(resolver) {
    this._resolvers.push(resolver);
    return this;
  }
  /**
   * Registers an icon using an HTML string in the specified namespace.
   * @param namespace Namespace in which the icon should be registered.
   * @param iconName Name under which the icon should be registered.
   * @param literal SVG source of the icon.
   */
  addSvgIconLiteralInNamespace(namespace, iconName, literal, options) {
    const cleanLiteral = this._sanitizer.sanitize(SecurityContext.HTML, literal);
    if (!cleanLiteral) {
      throw getMatIconFailedToSanitizeLiteralError(literal);
    }
    const trustedLiteral = trustedHTMLFromString(cleanLiteral);
    return this._addSvgIconConfig(namespace, iconName, new SvgIconConfig("", trustedLiteral, options));
  }
  /**
   * Registers an icon set by URL in the default namespace.
   * @param url
   */
  addSvgIconSet(url, options) {
    return this.addSvgIconSetInNamespace("", url, options);
  }
  /**
   * Registers an icon set using an HTML string in the default namespace.
   * @param literal SVG source of the icon set.
   */
  addSvgIconSetLiteral(literal, options) {
    return this.addSvgIconSetLiteralInNamespace("", literal, options);
  }
  /**
   * Registers an icon set by URL in the specified namespace.
   * @param namespace Namespace in which to register the icon set.
   * @param url
   */
  addSvgIconSetInNamespace(namespace, url, options) {
    return this._addSvgIconSetConfig(namespace, new SvgIconConfig(url, null, options));
  }
  /**
   * Registers an icon set using an HTML string in the specified namespace.
   * @param namespace Namespace in which to register the icon set.
   * @param literal SVG source of the icon set.
   */
  addSvgIconSetLiteralInNamespace(namespace, literal, options) {
    const cleanLiteral = this._sanitizer.sanitize(SecurityContext.HTML, literal);
    if (!cleanLiteral) {
      throw getMatIconFailedToSanitizeLiteralError(literal);
    }
    const trustedLiteral = trustedHTMLFromString(cleanLiteral);
    return this._addSvgIconSetConfig(namespace, new SvgIconConfig("", trustedLiteral, options));
  }
  /**
   * Defines an alias for CSS class names to be used for icon fonts. Creating an matIcon
   * component with the alias as the fontSet input will cause the class name to be applied
   * to the `<mat-icon>` element.
   *
   * If the registered font is a ligature font, then don't forget to also include the special
   * class `mat-ligature-font` to allow the usage via attribute. So register like this:
   *
   * ```ts
   * iconRegistry.registerFontClassAlias('f1', 'font1 mat-ligature-font');
   * ```
   *
   * And use like this:
   *
   * ```html
   * <mat-icon fontSet="f1" fontIcon="home"></mat-icon>
   * ```
   *
   * @param alias Alias for the font.
   * @param classNames Class names override to be used instead of the alias.
   */
  registerFontClassAlias(alias, classNames = alias) {
    this._fontCssClassesByAlias.set(alias, classNames);
    return this;
  }
  /**
   * Returns the CSS class name associated with the alias by a previous call to
   * registerFontClassAlias. If no CSS class has been associated, returns the alias unmodified.
   */
  classNameForFontAlias(alias) {
    return this._fontCssClassesByAlias.get(alias) || alias;
  }
  /**
   * Sets the CSS classes to be used for icon fonts when an `<mat-icon>` component does not
   * have a fontSet input value, and is not loading an icon by name or URL.
   */
  setDefaultFontSetClass(...classNames) {
    this._defaultFontSetClass = classNames;
    return this;
  }
  /**
   * Returns the CSS classes to be used for icon fonts when an `<mat-icon>` component does not
   * have a fontSet input value, and is not loading an icon by name or URL.
   */
  getDefaultFontSetClass() {
    return this._defaultFontSetClass;
  }
  /**
   * Returns an Observable that produces the icon (as an `<svg>` DOM element) from the given URL.
   * The response from the URL may be cached so this will not always cause an HTTP request, but
   * the produced element will always be a new copy of the originally fetched icon. (That is,
   * it will not contain any modifications made to elements previously returned).
   *
   * @param safeUrl URL from which to fetch the SVG icon.
   */
  getSvgIconFromUrl(safeUrl) {
    const url = this._sanitizer.sanitize(SecurityContext.RESOURCE_URL, safeUrl);
    if (!url) {
      throw getMatIconFailedToSanitizeUrlError(safeUrl);
    }
    const cachedIcon = this._cachedIconsByUrl.get(url);
    if (cachedIcon) {
      return of(cloneSvg(cachedIcon));
    }
    return this._loadSvgIconFromConfig(new SvgIconConfig(safeUrl, null)).pipe(tap((svg) => this._cachedIconsByUrl.set(url, svg)), map((svg) => cloneSvg(svg)));
  }
  /**
   * Returns an Observable that produces the icon (as an `<svg>` DOM element) with the given name
   * and namespace. The icon must have been previously registered with addIcon or addIconSet;
   * if not, the Observable will throw an error.
   *
   * @param name Name of the icon to be retrieved.
   * @param namespace Namespace in which to look for the icon.
   */
  getNamedSvgIcon(name, namespace = "") {
    const key = iconKey(namespace, name);
    let config = this._svgIconConfigs.get(key);
    if (config) {
      return this._getSvgFromConfig(config);
    }
    config = this._getIconConfigFromResolvers(namespace, name);
    if (config) {
      this._svgIconConfigs.set(key, config);
      return this._getSvgFromConfig(config);
    }
    const iconSetConfigs = this._iconSetConfigs.get(namespace);
    if (iconSetConfigs) {
      return this._getSvgFromIconSetConfigs(name, iconSetConfigs);
    }
    return throwError(getMatIconNameNotFoundError(key));
  }
  ngOnDestroy() {
    this._resolvers = [];
    this._svgIconConfigs.clear();
    this._iconSetConfigs.clear();
    this._cachedIconsByUrl.clear();
  }
  /**
   * Returns the cached icon for a SvgIconConfig if available, or fetches it from its URL if not.
   */
  _getSvgFromConfig(config) {
    if (config.svgText) {
      return of(cloneSvg(this._svgElementFromConfig(config)));
    } else {
      return this._loadSvgIconFromConfig(config).pipe(map((svg) => cloneSvg(svg)));
    }
  }
  /**
   * Attempts to find an icon with the specified name in any of the SVG icon sets.
   * First searches the available cached icons for a nested element with a matching name, and
   * if found copies the element to a new `<svg>` element. If not found, fetches all icon sets
   * that have not been cached, and searches again after all fetches are completed.
   * The returned Observable produces the SVG element if possible, and throws
   * an error if no icon with the specified name can be found.
   */
  _getSvgFromIconSetConfigs(name, iconSetConfigs) {
    const namedIcon = this._extractIconWithNameFromAnySet(name, iconSetConfigs);
    if (namedIcon) {
      return of(namedIcon);
    }
    const iconSetFetchRequests = iconSetConfigs.filter((iconSetConfig) => !iconSetConfig.svgText).map((iconSetConfig) => {
      return this._loadSvgIconSetFromConfig(iconSetConfig).pipe(catchError((err) => {
        const url = this._sanitizer.sanitize(SecurityContext.RESOURCE_URL, iconSetConfig.url);
        const errorMessage = `Loading icon set URL: ${url} failed: ${err.message}`;
        this._errorHandler.handleError(new Error(errorMessage));
        return of(null);
      }));
    });
    return forkJoin(iconSetFetchRequests).pipe(map(() => {
      const foundIcon = this._extractIconWithNameFromAnySet(name, iconSetConfigs);
      if (!foundIcon) {
        throw getMatIconNameNotFoundError(name);
      }
      return foundIcon;
    }));
  }
  /**
   * Searches the cached SVG elements for the given icon sets for a nested icon element whose "id"
   * tag matches the specified name. If found, copies the nested element to a new SVG element and
   * returns it. Returns null if no matching element is found.
   */
  _extractIconWithNameFromAnySet(iconName, iconSetConfigs) {
    for (let i = iconSetConfigs.length - 1; i >= 0; i--) {
      const config = iconSetConfigs[i];
      if (config.svgText && config.svgText.toString().indexOf(iconName) > -1) {
        const svg = this._svgElementFromConfig(config);
        const foundIcon = this._extractSvgIconFromSet(svg, iconName, config.options);
        if (foundIcon) {
          return foundIcon;
        }
      }
    }
    return null;
  }
  /**
   * Loads the content of the icon URL specified in the SvgIconConfig and creates an SVG element
   * from it.
   */
  _loadSvgIconFromConfig(config) {
    return this._fetchIcon(config).pipe(tap((svgText) => config.svgText = svgText), map(() => this._svgElementFromConfig(config)));
  }
  /**
   * Loads the content of the icon set URL specified in the
   * SvgIconConfig and attaches it to the config.
   */
  _loadSvgIconSetFromConfig(config) {
    if (config.svgText) {
      return of(null);
    }
    return this._fetchIcon(config).pipe(tap((svgText) => config.svgText = svgText));
  }
  /**
   * Searches the cached element of the given SvgIconConfig for a nested icon element whose "id"
   * tag matches the specified name. If found, copies the nested element to a new SVG element and
   * returns it. Returns null if no matching element is found.
   */
  _extractSvgIconFromSet(iconSet, iconName, options) {
    const iconSource = iconSet.querySelector(`[id="${iconName}"]`);
    if (!iconSource) {
      return null;
    }
    const iconElement = iconSource.cloneNode(true);
    iconElement.removeAttribute("id");
    if (iconElement.nodeName.toLowerCase() === "svg") {
      return this._setSvgAttributes(iconElement, options);
    }
    if (iconElement.nodeName.toLowerCase() === "symbol") {
      return this._setSvgAttributes(this._toSvgElement(iconElement), options);
    }
    const svg = this._svgElementFromString(trustedHTMLFromString("<svg></svg>"));
    svg.appendChild(iconElement);
    return this._setSvgAttributes(svg, options);
  }
  /**
   * Creates a DOM element from the given SVG string.
   */
  _svgElementFromString(str) {
    const div = this._document.createElement("DIV");
    div.innerHTML = str;
    const svg = div.querySelector("svg");
    if (!svg) {
      throw Error("<svg> tag not found");
    }
    return svg;
  }
  /**
   * Converts an element into an SVG node by cloning all of its children.
   */
  _toSvgElement(element) {
    const svg = this._svgElementFromString(trustedHTMLFromString("<svg></svg>"));
    const attributes = element.attributes;
    for (let i = 0; i < attributes.length; i++) {
      const {
        name,
        value
      } = attributes[i];
      if (name !== "id") {
        svg.setAttribute(name, value);
      }
    }
    for (let i = 0; i < element.childNodes.length; i++) {
      if (element.childNodes[i].nodeType === this._document.ELEMENT_NODE) {
        svg.appendChild(element.childNodes[i].cloneNode(true));
      }
    }
    return svg;
  }
  /**
   * Sets the default attributes for an SVG element to be used as an icon.
   */
  _setSvgAttributes(svg, options) {
    svg.setAttribute("fit", "");
    svg.setAttribute("height", "100%");
    svg.setAttribute("width", "100%");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.setAttribute("focusable", "false");
    if (options && options.viewBox) {
      svg.setAttribute("viewBox", options.viewBox);
    }
    return svg;
  }
  /**
   * Returns an Observable which produces the string contents of the given icon. Results may be
   * cached, so future calls with the same URL may not cause another HTTP request.
   */
  _fetchIcon(iconConfig) {
    const {
      url: safeUrl,
      options
    } = iconConfig;
    const withCredentials = options?.withCredentials ?? false;
    if (!this._httpClient) {
      throw getMatIconNoHttpProviderError();
    }
    if (safeUrl == null) {
      throw Error(`Cannot fetch icon from URL "${safeUrl}".`);
    }
    const url = this._sanitizer.sanitize(SecurityContext.RESOURCE_URL, safeUrl);
    if (!url) {
      throw getMatIconFailedToSanitizeUrlError(safeUrl);
    }
    const inProgressFetch = this._inProgressUrlFetches.get(url);
    if (inProgressFetch) {
      return inProgressFetch;
    }
    const req = this._httpClient.get(url, {
      responseType: "text",
      withCredentials
    }).pipe(map((svg) => {
      return trustedHTMLFromString(svg);
    }), finalize(() => this._inProgressUrlFetches.delete(url)), share());
    this._inProgressUrlFetches.set(url, req);
    return req;
  }
  /**
   * Registers an icon config by name in the specified namespace.
   * @param namespace Namespace in which to register the icon config.
   * @param iconName Name under which to register the config.
   * @param config Config to be registered.
   */
  _addSvgIconConfig(namespace, iconName, config) {
    this._svgIconConfigs.set(iconKey(namespace, iconName), config);
    return this;
  }
  /**
   * Registers an icon set config in the specified namespace.
   * @param namespace Namespace in which to register the icon config.
   * @param config Config to be registered.
   */
  _addSvgIconSetConfig(namespace, config) {
    const configNamespace = this._iconSetConfigs.get(namespace);
    if (configNamespace) {
      configNamespace.push(config);
    } else {
      this._iconSetConfigs.set(namespace, [config]);
    }
    return this;
  }
  /** Parses a config's text into an SVG element. */
  _svgElementFromConfig(config) {
    if (!config.svgElement) {
      const svg = this._svgElementFromString(config.svgText);
      this._setSvgAttributes(svg, config.options);
      config.svgElement = svg;
    }
    return config.svgElement;
  }
  /** Tries to create an icon config through the registered resolver functions. */
  _getIconConfigFromResolvers(namespace, name) {
    for (let i = 0; i < this._resolvers.length; i++) {
      const result = this._resolvers[i](name, namespace);
      if (result) {
        return isSafeUrlWithOptions(result) ? new SvgIconConfig(result.url, null, result.options) : new SvgIconConfig(result, null);
      }
    }
    return void 0;
  }
  static ɵfac = function MatIconRegistry_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatIconRegistry)(ɵɵinject(HttpClient, 8), ɵɵinject(DomSanitizer), ɵɵinject(DOCUMENT, 8), ɵɵinject(ErrorHandler));
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _MatIconRegistry,
    factory: _MatIconRegistry.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatIconRegistry, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: HttpClient,
    decorators: [{
      type: Optional
    }]
  }, {
    type: DomSanitizer
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [DOCUMENT]
    }]
  }, {
    type: ErrorHandler
  }], null);
})();
function ICON_REGISTRY_PROVIDER_FACTORY(parentRegistry, httpClient, sanitizer, errorHandler, document) {
  return parentRegistry || new MatIconRegistry(httpClient, sanitizer, document, errorHandler);
}
var ICON_REGISTRY_PROVIDER = {
  // If there is already an MatIconRegistry available, use that. Otherwise, provide a new one.
  provide: MatIconRegistry,
  deps: [[new Optional(), new SkipSelf(), MatIconRegistry], [new Optional(), HttpClient], DomSanitizer, ErrorHandler, [new Optional(), DOCUMENT]],
  useFactory: ICON_REGISTRY_PROVIDER_FACTORY
};
function cloneSvg(svg) {
  return svg.cloneNode(true);
}
function iconKey(namespace, name) {
  return namespace + ":" + name;
}
function isSafeUrlWithOptions(value) {
  return !!(value.url && value.options);
}

// node_modules/@angular/material/fesm2022/icon-module-a8f2a673.mjs
var _c02 = ["*"];
var MAT_ICON_DEFAULT_OPTIONS = new InjectionToken("MAT_ICON_DEFAULT_OPTIONS");
var MAT_ICON_LOCATION = new InjectionToken("mat-icon-location", {
  providedIn: "root",
  factory: MAT_ICON_LOCATION_FACTORY
});
function MAT_ICON_LOCATION_FACTORY() {
  const _document = inject(DOCUMENT);
  const _location = _document ? _document.location : null;
  return {
    // Note that this needs to be a function, rather than a property, because Angular
    // will only resolve it once, but we want the current path on each call.
    getPathname: () => _location ? _location.pathname + _location.search : ""
  };
}
var funcIriAttributes = ["clip-path", "color-profile", "src", "cursor", "fill", "filter", "marker", "marker-start", "marker-mid", "marker-end", "mask", "stroke"];
var funcIriAttributeSelector = funcIriAttributes.map((attr) => `[${attr}]`).join(", ");
var funcIriPattern = /^url\(['"]?#(.*?)['"]?\)$/;
var MatIcon = class _MatIcon {
  _elementRef = inject(ElementRef);
  _iconRegistry = inject(MatIconRegistry);
  _location = inject(MAT_ICON_LOCATION);
  _errorHandler = inject(ErrorHandler);
  _defaultColor;
  /**
   * Theme color of the icon. This API is supported in M2 themes only, it
   * has no effect in M3 themes. For color customization in M3, see https://material.angular.io/components/icon/styling.
   *
   * For information on applying color variants in M3, see
   * https://material.angular.io/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
   */
  get color() {
    return this._color || this._defaultColor;
  }
  set color(value) {
    this._color = value;
  }
  _color;
  /**
   * Whether the icon should be inlined, automatically sizing the icon to match the font size of
   * the element the icon is contained in.
   */
  inline = false;
  /** Name of the icon in the SVG icon set. */
  get svgIcon() {
    return this._svgIcon;
  }
  set svgIcon(value) {
    if (value !== this._svgIcon) {
      if (value) {
        this._updateSvgIcon(value);
      } else if (this._svgIcon) {
        this._clearSvgElement();
      }
      this._svgIcon = value;
    }
  }
  _svgIcon;
  /** Font set that the icon is a part of. */
  get fontSet() {
    return this._fontSet;
  }
  set fontSet(value) {
    const newValue = this._cleanupFontValue(value);
    if (newValue !== this._fontSet) {
      this._fontSet = newValue;
      this._updateFontIconClasses();
    }
  }
  _fontSet;
  /** Name of an icon within a font set. */
  get fontIcon() {
    return this._fontIcon;
  }
  set fontIcon(value) {
    const newValue = this._cleanupFontValue(value);
    if (newValue !== this._fontIcon) {
      this._fontIcon = newValue;
      this._updateFontIconClasses();
    }
  }
  _fontIcon;
  _previousFontSetClass = [];
  _previousFontIconClass;
  _svgName;
  _svgNamespace;
  /** Keeps track of the current page path. */
  _previousPath;
  /** Keeps track of the elements and attributes that we've prefixed with the current path. */
  _elementsWithExternalReferences;
  /** Subscription to the current in-progress SVG icon request. */
  _currentIconFetch = Subscription.EMPTY;
  constructor() {
    const ariaHidden = inject(new HostAttributeToken("aria-hidden"), {
      optional: true
    });
    const defaults = inject(MAT_ICON_DEFAULT_OPTIONS, {
      optional: true
    });
    if (defaults) {
      if (defaults.color) {
        this.color = this._defaultColor = defaults.color;
      }
      if (defaults.fontSet) {
        this.fontSet = defaults.fontSet;
      }
    }
    if (!ariaHidden) {
      this._elementRef.nativeElement.setAttribute("aria-hidden", "true");
    }
  }
  /**
   * Splits an svgIcon binding value into its icon set and icon name components.
   * Returns a 2-element array of [(icon set), (icon name)].
   * The separator for the two fields is ':'. If there is no separator, an empty
   * string is returned for the icon set and the entire value is returned for
   * the icon name. If the argument is falsy, returns an array of two empty strings.
   * Throws an error if the name contains two or more ':' separators.
   * Examples:
   *   `'social:cake' -> ['social', 'cake']
   *   'penguin' -> ['', 'penguin']
   *   null -> ['', '']
   *   'a:b:c' -> (throws Error)`
   */
  _splitIconName(iconName) {
    if (!iconName) {
      return ["", ""];
    }
    const parts = iconName.split(":");
    switch (parts.length) {
      case 1:
        return ["", parts[0]];
      // Use default namespace.
      case 2:
        return parts;
      default:
        throw Error(`Invalid icon name: "${iconName}"`);
    }
  }
  ngOnInit() {
    this._updateFontIconClasses();
  }
  ngAfterViewChecked() {
    const cachedElements = this._elementsWithExternalReferences;
    if (cachedElements && cachedElements.size) {
      const newPath = this._location.getPathname();
      if (newPath !== this._previousPath) {
        this._previousPath = newPath;
        this._prependPathToReferences(newPath);
      }
    }
  }
  ngOnDestroy() {
    this._currentIconFetch.unsubscribe();
    if (this._elementsWithExternalReferences) {
      this._elementsWithExternalReferences.clear();
    }
  }
  _usingFontIcon() {
    return !this.svgIcon;
  }
  _setSvgElement(svg) {
    this._clearSvgElement();
    const path = this._location.getPathname();
    this._previousPath = path;
    this._cacheChildrenWithExternalReferences(svg);
    this._prependPathToReferences(path);
    this._elementRef.nativeElement.appendChild(svg);
  }
  _clearSvgElement() {
    const layoutElement = this._elementRef.nativeElement;
    let childCount = layoutElement.childNodes.length;
    if (this._elementsWithExternalReferences) {
      this._elementsWithExternalReferences.clear();
    }
    while (childCount--) {
      const child = layoutElement.childNodes[childCount];
      if (child.nodeType !== 1 || child.nodeName.toLowerCase() === "svg") {
        child.remove();
      }
    }
  }
  _updateFontIconClasses() {
    if (!this._usingFontIcon()) {
      return;
    }
    const elem = this._elementRef.nativeElement;
    const fontSetClasses = (this.fontSet ? this._iconRegistry.classNameForFontAlias(this.fontSet).split(/ +/) : this._iconRegistry.getDefaultFontSetClass()).filter((className) => className.length > 0);
    this._previousFontSetClass.forEach((className) => elem.classList.remove(className));
    fontSetClasses.forEach((className) => elem.classList.add(className));
    this._previousFontSetClass = fontSetClasses;
    if (this.fontIcon !== this._previousFontIconClass && !fontSetClasses.includes("mat-ligature-font")) {
      if (this._previousFontIconClass) {
        elem.classList.remove(this._previousFontIconClass);
      }
      if (this.fontIcon) {
        elem.classList.add(this.fontIcon);
      }
      this._previousFontIconClass = this.fontIcon;
    }
  }
  /**
   * Cleans up a value to be used as a fontIcon or fontSet.
   * Since the value ends up being assigned as a CSS class, we
   * have to trim the value and omit space-separated values.
   */
  _cleanupFontValue(value) {
    return typeof value === "string" ? value.trim().split(" ")[0] : value;
  }
  /**
   * Prepends the current path to all elements that have an attribute pointing to a `FuncIRI`
   * reference. This is required because WebKit browsers require references to be prefixed with
   * the current path, if the page has a `base` tag.
   */
  _prependPathToReferences(path) {
    const elements = this._elementsWithExternalReferences;
    if (elements) {
      elements.forEach((attrs, element) => {
        attrs.forEach((attr) => {
          element.setAttribute(attr.name, `url('${path}#${attr.value}')`);
        });
      });
    }
  }
  /**
   * Caches the children of an SVG element that have `url()`
   * references that we need to prefix with the current path.
   */
  _cacheChildrenWithExternalReferences(element) {
    const elementsWithFuncIri = element.querySelectorAll(funcIriAttributeSelector);
    const elements = this._elementsWithExternalReferences = this._elementsWithExternalReferences || /* @__PURE__ */ new Map();
    for (let i = 0; i < elementsWithFuncIri.length; i++) {
      funcIriAttributes.forEach((attr) => {
        const elementWithReference = elementsWithFuncIri[i];
        const value = elementWithReference.getAttribute(attr);
        const match = value ? value.match(funcIriPattern) : null;
        if (match) {
          let attributes = elements.get(elementWithReference);
          if (!attributes) {
            attributes = [];
            elements.set(elementWithReference, attributes);
          }
          attributes.push({
            name: attr,
            value: match[1]
          });
        }
      });
    }
  }
  /** Sets a new SVG icon with a particular name. */
  _updateSvgIcon(rawName) {
    this._svgNamespace = null;
    this._svgName = null;
    this._currentIconFetch.unsubscribe();
    if (rawName) {
      const [namespace, iconName] = this._splitIconName(rawName);
      if (namespace) {
        this._svgNamespace = namespace;
      }
      if (iconName) {
        this._svgName = iconName;
      }
      this._currentIconFetch = this._iconRegistry.getNamedSvgIcon(iconName, namespace).pipe(take(1)).subscribe((svg) => this._setSvgElement(svg), (err) => {
        const errorMessage = `Error retrieving icon ${namespace}:${iconName}! ${err.message}`;
        this._errorHandler.handleError(new Error(errorMessage));
      });
    }
  }
  static ɵfac = function MatIcon_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatIcon)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _MatIcon,
    selectors: [["mat-icon"]],
    hostAttrs: ["role", "img", 1, "mat-icon", "notranslate"],
    hostVars: 10,
    hostBindings: function MatIcon_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("data-mat-icon-type", ctx._usingFontIcon() ? "font" : "svg")("data-mat-icon-name", ctx._svgName || ctx.fontIcon)("data-mat-icon-namespace", ctx._svgNamespace || ctx.fontSet)("fontIcon", ctx._usingFontIcon() ? ctx.fontIcon : null);
        ɵɵclassMap(ctx.color ? "mat-" + ctx.color : "");
        ɵɵclassProp("mat-icon-inline", ctx.inline)("mat-icon-no-color", ctx.color !== "primary" && ctx.color !== "accent" && ctx.color !== "warn");
      }
    },
    inputs: {
      color: "color",
      inline: [2, "inline", "inline", booleanAttribute],
      svgIcon: "svgIcon",
      fontSet: "fontSet",
      fontIcon: "fontIcon"
    },
    exportAs: ["matIcon"],
    ngContentSelectors: _c02,
    decls: 1,
    vars: 0,
    template: function MatIcon_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    styles: ["mat-icon,mat-icon.mat-primary,mat-icon.mat-accent,mat-icon.mat-warn{color:var(--mat-icon-color, inherit)}.mat-icon{-webkit-user-select:none;user-select:none;background-repeat:no-repeat;display:inline-block;fill:currentColor;height:24px;width:24px;overflow:hidden}.mat-icon.mat-icon-inline{font-size:inherit;height:inherit;line-height:inherit;width:inherit}.mat-icon.mat-ligature-font[fontIcon]::before{content:attr(fontIcon)}[dir=rtl] .mat-icon-rtl-mirror{transform:scale(-1, 1)}.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon,.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon{display:block}.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon-button .mat-icon,.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon-button .mat-icon{margin:auto}"],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatIcon, [{
    type: Component,
    args: [{
      template: "<ng-content></ng-content>",
      selector: "mat-icon",
      exportAs: "matIcon",
      host: {
        "role": "img",
        "class": "mat-icon notranslate",
        "[class]": 'color ? "mat-" + color : ""',
        "[attr.data-mat-icon-type]": '_usingFontIcon() ? "font" : "svg"',
        "[attr.data-mat-icon-name]": "_svgName || fontIcon",
        "[attr.data-mat-icon-namespace]": "_svgNamespace || fontSet",
        "[attr.fontIcon]": "_usingFontIcon() ? fontIcon : null",
        "[class.mat-icon-inline]": "inline",
        "[class.mat-icon-no-color]": 'color !== "primary" && color !== "accent" && color !== "warn"'
      },
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      styles: ["mat-icon,mat-icon.mat-primary,mat-icon.mat-accent,mat-icon.mat-warn{color:var(--mat-icon-color, inherit)}.mat-icon{-webkit-user-select:none;user-select:none;background-repeat:no-repeat;display:inline-block;fill:currentColor;height:24px;width:24px;overflow:hidden}.mat-icon.mat-icon-inline{font-size:inherit;height:inherit;line-height:inherit;width:inherit}.mat-icon.mat-ligature-font[fontIcon]::before{content:attr(fontIcon)}[dir=rtl] .mat-icon-rtl-mirror{transform:scale(-1, 1)}.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon,.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon{display:block}.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon-button .mat-icon,.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon-button .mat-icon{margin:auto}"]
    }]
  }], () => [], {
    color: [{
      type: Input
    }],
    inline: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    svgIcon: [{
      type: Input
    }],
    fontSet: [{
      type: Input
    }],
    fontIcon: [{
      type: Input
    }]
  });
})();
var MatIconModule = class _MatIconModule {
  static ɵfac = function MatIconModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatIconModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _MatIconModule,
    imports: [MatCommonModule, MatIcon],
    exports: [MatIcon, MatCommonModule]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [MatCommonModule, MatCommonModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatIconModule, [{
    type: NgModule,
    args: [{
      imports: [MatCommonModule, MatIcon],
      exports: [MatIcon, MatCommonModule]
    }]
  }], null, null);
})();

// node_modules/@angular/material/fesm2022/stepper.mjs
function MatStepHeader_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0, 2);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵproperty("ngTemplateOutlet", ctx_r0.iconOverrides[ctx_r0.state])("ngTemplateOutletContext", ctx_r0._getIconContext());
  }
}
function MatStepHeader_Conditional_4_Case_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span", 7);
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r0._getDefaultTextForState(ctx_r0.state));
  }
}
function MatStepHeader_Conditional_4_Case_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span", 8);
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(3);
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r0._intl.completedLabel);
  }
}
function MatStepHeader_Conditional_4_Case_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span", 8);
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(3);
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r0._intl.editableLabel);
  }
}
function MatStepHeader_Conditional_4_Case_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, MatStepHeader_Conditional_4_Case_1_Conditional_0_Template, 2, 1, "span", 8)(1, MatStepHeader_Conditional_4_Case_1_Conditional_1_Template, 2, 1, "span", 8);
    ɵɵelementStart(2, "mat-icon", 7);
    ɵɵtext(3);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵconditional(ctx_r0.state === "done" ? 0 : ctx_r0.state === "edit" ? 1 : -1);
    ɵɵadvance(3);
    ɵɵtextInterpolate(ctx_r0._getDefaultTextForState(ctx_r0.state));
  }
}
function MatStepHeader_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, MatStepHeader_Conditional_4_Case_0_Template, 2, 1, "span", 7)(1, MatStepHeader_Conditional_4_Case_1_Template, 4, 2);
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = ɵɵnextContext();
    ɵɵconditional((tmp_1_0 = ctx_r0.state) === "number" ? 0 : 1);
  }
}
function MatStepHeader_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 4);
    ɵɵelementContainer(1, 9);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctx.template);
  }
}
function MatStepHeader_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 4);
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r0.label);
  }
}
function MatStepHeader_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 5);
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r0._intl.optionalLabel);
  }
}
function MatStepHeader_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 6);
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r0.errorMessage);
  }
}
var _c03 = ["*"];
function MatStep_ng_template_0_ng_template_1_Template(rf, ctx) {
}
function MatStep_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0);
    ɵɵtemplate(1, MatStep_ng_template_0_ng_template_1_Template, 0, 0, "ng-template", 0);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵproperty("cdkPortalOutlet", ctx_r0._portal);
  }
}
var _c1 = ["animatedContainer"];
var _c2 = (a0, a1) => ({
  step: a0,
  i: a1
});
function MatStepper_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0);
  }
}
function MatStepper_Case_1_For_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "div", 7);
  }
}
function MatStepper_Case_1_For_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0, 6);
    ɵɵtemplate(1, MatStepper_Case_1_For_3_Conditional_1_Template, 1, 0, "div", 7);
  }
  if (rf & 2) {
    const step_r1 = ctx.$implicit;
    const $index_r2 = ctx.$index;
    const ɵ$index_8_r3 = ctx.$index;
    const ɵ$count_8_r4 = ctx.$count;
    ɵɵnextContext(2);
    const stepTemplate_r5 = ɵɵreference(4);
    ɵɵproperty("ngTemplateOutlet", stepTemplate_r5)("ngTemplateOutletContext", ɵɵpureFunction2(3, _c2, step_r1, $index_r2));
    ɵɵadvance();
    ɵɵconditional(!(ɵ$index_8_r3 === ɵ$count_8_r4 - 1) ? 1 : -1);
  }
}
function MatStepper_Case_1_For_6_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 8, 1);
    ɵɵelementContainer(2, 9);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const step_r6 = ctx.$implicit;
    const $index_r7 = ctx.$index;
    const ctx_r7 = ɵɵnextContext(2);
    ɵɵclassMap("mat-horizontal-stepper-content-" + ctx_r7._getAnimationDirection($index_r7));
    ɵɵproperty("id", ctx_r7._getStepContentId($index_r7));
    ɵɵattribute("aria-labelledby", ctx_r7._getStepLabelId($index_r7))("inert", ctx_r7.selectedIndex === $index_r7 ? null : "");
    ɵɵadvance(2);
    ɵɵproperty("ngTemplateOutlet", step_r6.content);
  }
}
function MatStepper_Case_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 2)(1, "div", 3);
    ɵɵrepeaterCreate(2, MatStepper_Case_1_For_3_Template, 2, 6, null, null, ɵɵrepeaterTrackByIdentity);
    ɵɵelementEnd();
    ɵɵelementStart(4, "div", 4);
    ɵɵrepeaterCreate(5, MatStepper_Case_1_For_6_Template, 3, 6, "div", 5, ɵɵrepeaterTrackByIdentity);
    ɵɵelementEnd()();
  }
  if (rf & 2) {
    const ctx_r7 = ɵɵnextContext();
    ɵɵadvance(2);
    ɵɵrepeater(ctx_r7.steps);
    ɵɵadvance(3);
    ɵɵrepeater(ctx_r7.steps);
  }
}
function MatStepper_Case_2_For_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 10);
    ɵɵelementContainer(1, 6);
    ɵɵelementStart(2, "div", 11, 1)(4, "div", 12)(5, "div", 13);
    ɵɵelementContainer(6, 9);
    ɵɵelementEnd()()()();
  }
  if (rf & 2) {
    const step_r9 = ctx.$implicit;
    const $index_r10 = ctx.$index;
    const ɵ$index_22_r11 = ctx.$index;
    const ɵ$count_22_r12 = ctx.$count;
    const ctx_r7 = ɵɵnextContext(2);
    const stepTemplate_r5 = ɵɵreference(4);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", stepTemplate_r5)("ngTemplateOutletContext", ɵɵpureFunction2(10, _c2, step_r9, $index_r10));
    ɵɵadvance();
    ɵɵclassProp("mat-stepper-vertical-line", !(ɵ$index_22_r11 === ɵ$count_22_r12 - 1))("mat-vertical-content-container-active", ctx_r7.selectedIndex === $index_r10);
    ɵɵattribute("inert", ctx_r7.selectedIndex === $index_r10 ? null : "");
    ɵɵadvance(2);
    ɵɵproperty("id", ctx_r7._getStepContentId($index_r10));
    ɵɵattribute("aria-labelledby", ctx_r7._getStepLabelId($index_r10));
    ɵɵadvance(2);
    ɵɵproperty("ngTemplateOutlet", step_r9.content);
  }
}
function MatStepper_Case_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵrepeaterCreate(0, MatStepper_Case_2_For_1_Template, 7, 13, "div", 10, ɵɵrepeaterTrackByIdentity);
  }
  if (rf & 2) {
    const ctx_r7 = ɵɵnextContext();
    ɵɵrepeater(ctx_r7.steps);
  }
}
function MatStepper_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "mat-step-header", 14);
    ɵɵlistener("click", function MatStepper_ng_template_3_Template_mat_step_header_click_0_listener() {
      const step_r14 = ɵɵrestoreView(_r13).step;
      return ɵɵresetView(step_r14.select());
    })("keydown", function MatStepper_ng_template_3_Template_mat_step_header_keydown_0_listener($event) {
      ɵɵrestoreView(_r13);
      const ctx_r7 = ɵɵnextContext();
      return ɵɵresetView(ctx_r7._onKeydown($event));
    });
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const step_r14 = ctx.step;
    const i_r15 = ctx.i;
    const ctx_r7 = ɵɵnextContext();
    ɵɵclassProp("mat-horizontal-stepper-header", ctx_r7.orientation === "horizontal")("mat-vertical-stepper-header", ctx_r7.orientation === "vertical");
    ɵɵproperty("tabIndex", ctx_r7._getFocusIndex() === i_r15 ? 0 : -1)("id", ctx_r7._getStepLabelId(i_r15))("index", i_r15)("state", ctx_r7._getIndicatorType(i_r15, step_r14.state))("label", step_r14.stepLabel || step_r14.label)("selected", ctx_r7.selectedIndex === i_r15)("active", ctx_r7._stepIsNavigable(i_r15, step_r14))("optional", step_r14.optional)("errorMessage", step_r14.errorMessage)("iconOverrides", ctx_r7._iconOverrides)("disableRipple", ctx_r7.disableRipple || !ctx_r7._stepIsNavigable(i_r15, step_r14))("color", step_r14.color || ctx_r7.color);
    ɵɵattribute("aria-posinset", i_r15 + 1)("aria-setsize", ctx_r7.steps.length)("aria-controls", ctx_r7._getStepContentId(i_r15))("aria-selected", ctx_r7.selectedIndex == i_r15)("aria-label", step_r14.ariaLabel || null)("aria-labelledby", !step_r14.ariaLabel && step_r14.ariaLabelledby ? step_r14.ariaLabelledby : null)("aria-disabled", ctx_r7._stepIsNavigable(i_r15, step_r14) ? null : true);
  }
}
var MatStepLabel = class _MatStepLabel extends CdkStepLabel {
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵMatStepLabel_BaseFactory;
    return function MatStepLabel_Factory(__ngFactoryType__) {
      return (ɵMatStepLabel_BaseFactory || (ɵMatStepLabel_BaseFactory = ɵɵgetInheritedFactory(_MatStepLabel)))(__ngFactoryType__ || _MatStepLabel);
    };
  })();
  static ɵdir = ɵɵdefineDirective({
    type: _MatStepLabel,
    selectors: [["", "matStepLabel", ""]],
    features: [ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatStepLabel, [{
    type: Directive,
    args: [{
      selector: "[matStepLabel]"
    }]
  }], null, null);
})();
var MatStepperIntl = class _MatStepperIntl {
  /**
   * Stream that emits whenever the labels here are changed. Use this to notify
   * components if the labels have changed after initialization.
   */
  changes = new Subject();
  /** Label that is rendered below optional steps. */
  optionalLabel = "Optional";
  /** Label that is used to indicate step as completed to screen readers. */
  completedLabel = "Completed";
  /** Label that is used to indicate step as editable to screen readers. */
  editableLabel = "Editable";
  static ɵfac = function MatStepperIntl_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatStepperIntl)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _MatStepperIntl,
    factory: _MatStepperIntl.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatStepperIntl, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
function MAT_STEPPER_INTL_PROVIDER_FACTORY(parentIntl) {
  return parentIntl || new MatStepperIntl();
}
var MAT_STEPPER_INTL_PROVIDER = {
  provide: MatStepperIntl,
  deps: [[new Optional(), new SkipSelf(), MatStepperIntl]],
  useFactory: MAT_STEPPER_INTL_PROVIDER_FACTORY
};
var MatStepHeader = class _MatStepHeader extends CdkStepHeader {
  _intl = inject(MatStepperIntl);
  _focusMonitor = inject(FocusMonitor);
  _intlSubscription;
  /** State of the given step. */
  state;
  /** Label of the given step. */
  label;
  /** Error message to display when there's an error. */
  errorMessage;
  /** Overrides for the header icons, passed in via the stepper. */
  iconOverrides;
  /** Index of the given step. */
  index;
  /** Whether the given step is selected. */
  selected;
  /** Whether the given step label is active. */
  active;
  /** Whether the given step is optional. */
  optional;
  /** Whether the ripple should be disabled. */
  disableRipple;
  /**
   * Theme color of the step header. This API is supported in M2 themes only, it
   * has no effect in M3 themes. For color customization in M3, see https://material.angular.io/components/stepper/styling.
   *
   * For information on applying color variants in M3, see
   * https://material.angular.io/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
   */
  color;
  constructor() {
    super();
    const styleLoader = inject(_CdkPrivateStyleLoader);
    styleLoader.load(_StructuralStylesLoader);
    styleLoader.load(_VisuallyHiddenLoader);
    const changeDetectorRef = inject(ChangeDetectorRef);
    this._intlSubscription = this._intl.changes.subscribe(() => changeDetectorRef.markForCheck());
  }
  ngAfterViewInit() {
    this._focusMonitor.monitor(this._elementRef, true);
  }
  ngOnDestroy() {
    this._intlSubscription.unsubscribe();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }
  /** Focuses the step header. */
  focus(origin, options) {
    if (origin) {
      this._focusMonitor.focusVia(this._elementRef, origin, options);
    } else {
      this._elementRef.nativeElement.focus(options);
    }
  }
  /** Returns string label of given step if it is a text label. */
  _stringLabel() {
    return this.label instanceof MatStepLabel ? null : this.label;
  }
  /** Returns MatStepLabel if the label of given step is a template label. */
  _templateLabel() {
    return this.label instanceof MatStepLabel ? this.label : null;
  }
  /** Returns the host HTML element. */
  _getHostElement() {
    return this._elementRef.nativeElement;
  }
  /** Template context variables that are exposed to the `matStepperIcon` instances. */
  _getIconContext() {
    return {
      index: this.index,
      active: this.active,
      optional: this.optional
    };
  }
  _getDefaultTextForState(state) {
    if (state == "number") {
      return `${this.index + 1}`;
    }
    if (state == "edit") {
      return "create";
    }
    if (state == "error") {
      return "warning";
    }
    return state;
  }
  static ɵfac = function MatStepHeader_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatStepHeader)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _MatStepHeader,
    selectors: [["mat-step-header"]],
    hostAttrs: ["role", "tab", 1, "mat-step-header"],
    hostVars: 2,
    hostBindings: function MatStepHeader_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassMap("mat-" + (ctx.color || "primary"));
      }
    },
    inputs: {
      state: "state",
      label: "label",
      errorMessage: "errorMessage",
      iconOverrides: "iconOverrides",
      index: "index",
      selected: "selected",
      active: "active",
      optional: "optional",
      disableRipple: "disableRipple",
      color: "color"
    },
    features: [ɵɵInheritDefinitionFeature],
    decls: 10,
    vars: 17,
    consts: [["matRipple", "", 1, "mat-step-header-ripple", "mat-focus-indicator", 3, "matRippleTrigger", "matRippleDisabled"], [1, "mat-step-icon-content"], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], [1, "mat-step-label"], [1, "mat-step-text-label"], [1, "mat-step-optional"], [1, "mat-step-sub-label-error"], ["aria-hidden", "true"], [1, "cdk-visually-hidden"], [3, "ngTemplateOutlet"]],
    template: function MatStepHeader_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵelement(0, "div", 0);
        ɵɵelementStart(1, "div")(2, "div", 1);
        ɵɵtemplate(3, MatStepHeader_Conditional_3_Template, 1, 2, "ng-container", 2)(4, MatStepHeader_Conditional_4_Template, 2, 1);
        ɵɵelementEnd()();
        ɵɵelementStart(5, "div", 3);
        ɵɵtemplate(6, MatStepHeader_Conditional_6_Template, 2, 1, "div", 4)(7, MatStepHeader_Conditional_7_Template, 2, 1, "div", 4)(8, MatStepHeader_Conditional_8_Template, 2, 1, "div", 5)(9, MatStepHeader_Conditional_9_Template, 2, 1, "div", 6);
        ɵɵelementEnd();
      }
      if (rf & 2) {
        let tmp_8_0;
        ɵɵproperty("matRippleTrigger", ctx._getHostElement())("matRippleDisabled", ctx.disableRipple);
        ɵɵadvance();
        ɵɵclassMapInterpolate1("mat-step-icon-state-", ctx.state, " mat-step-icon");
        ɵɵclassProp("mat-step-icon-selected", ctx.selected);
        ɵɵadvance(2);
        ɵɵconditional(ctx.iconOverrides && ctx.iconOverrides[ctx.state] ? 3 : 4);
        ɵɵadvance(2);
        ɵɵclassProp("mat-step-label-active", ctx.active)("mat-step-label-selected", ctx.selected)("mat-step-label-error", ctx.state == "error");
        ɵɵadvance();
        ɵɵconditional((tmp_8_0 = ctx._templateLabel()) ? 6 : ctx._stringLabel() ? 7 : -1, tmp_8_0);
        ɵɵadvance(2);
        ɵɵconditional(ctx.optional && ctx.state != "error" ? 8 : -1);
        ɵɵadvance();
        ɵɵconditional(ctx.state === "error" ? 9 : -1);
      }
    },
    dependencies: [MatRipple, NgTemplateOutlet, MatIcon],
    styles: ['.mat-step-header{overflow:hidden;outline:none;cursor:pointer;position:relative;box-sizing:content-box;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-step-header:focus .mat-focus-indicator::before{content:""}.mat-step-header:hover[aria-disabled=true]{cursor:default}.mat-step-header:hover:not([aria-disabled]),.mat-step-header:hover[aria-disabled=false]{background-color:var(--mat-stepper-header-hover-state-layer-color, color-mix(in srgb, var(--mat-sys-inverse-surface) calc(var(--mat-sys-hover-state-layer-opacity) * 100%), transparent));border-radius:var(--mat-stepper-header-hover-state-layer-shape, var(--mat-sys-corner-medium))}.mat-step-header.cdk-keyboard-focused,.mat-step-header.cdk-program-focused{background-color:var(--mat-stepper-header-focus-state-layer-color, color-mix(in srgb, var(--mat-sys-inverse-surface) calc(var(--mat-sys-focus-state-layer-opacity) * 100%), transparent));border-radius:var(--mat-stepper-header-focus-state-layer-shape, var(--mat-sys-corner-medium))}@media(hover: none){.mat-step-header:hover{background:none}}@media(forced-colors: active){.mat-step-header{outline:solid 1px}.mat-step-header[aria-selected=true] .mat-step-label{text-decoration:underline}.mat-step-header[aria-disabled=true]{outline-color:GrayText}.mat-step-header[aria-disabled=true] .mat-step-label,.mat-step-header[aria-disabled=true] .mat-step-icon,.mat-step-header[aria-disabled=true] .mat-step-optional{color:GrayText}}.mat-step-optional{font-size:12px;color:var(--mat-stepper-header-optional-label-text-color, var(--mat-sys-on-surface-variant))}.mat-step-sub-label-error{font-size:12px;font-weight:normal}.mat-step-icon{border-radius:50%;height:24px;width:24px;flex-shrink:0;position:relative;color:var(--mat-stepper-header-icon-foreground-color, var(--mat-sys-surface));background-color:var(--mat-stepper-header-icon-background-color, var(--mat-sys-on-surface-variant))}.mat-step-icon-content{position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);display:flex}.mat-step-icon .mat-icon{font-size:16px;height:16px;width:16px}.mat-step-icon-state-error{background-color:var(--mat-stepper-header-error-state-icon-background-color, transparent);color:var(--mat-stepper-header-error-state-icon-foreground-color, var(--mat-sys-error))}.mat-step-icon-state-error .mat-icon{font-size:24px;height:24px;width:24px}.mat-step-label{display:inline-block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:50px;vertical-align:middle;font-family:var(--mat-stepper-header-label-text-font, var(--mat-sys-title-small-font));font-size:var(--mat-stepper-header-label-text-size, var(--mat-sys-title-small-size));font-weight:var(--mat-stepper-header-label-text-weight, var(--mat-sys-title-small-weight));color:var(--mat-stepper-header-label-text-color, var(--mat-sys-on-surface-variant))}.mat-step-label.mat-step-label-active{color:var(--mat-stepper-header-selected-state-label-text-color, var(--mat-sys-on-surface-variant))}.mat-step-label.mat-step-label-error{color:var(--mat-stepper-header-error-state-label-text-color, var(--mat-sys-error));font-size:var(--mat-stepper-header-error-state-label-text-size, var(--mat-sys-title-small-size))}.mat-step-label.mat-step-label-selected{font-size:var(--mat-stepper-header-selected-state-label-text-size, var(--mat-sys-title-small-size));font-weight:var(--mat-stepper-header-selected-state-label-text-weight, var(--mat-sys-title-small-weight))}.mat-step-text-label{text-overflow:ellipsis;overflow:hidden}.mat-step-header .mat-step-header-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-step-icon-selected{background-color:var(--mat-stepper-header-selected-state-icon-background-color, var(--mat-sys-primary));color:var(--mat-stepper-header-selected-state-icon-foreground-color, var(--mat-sys-on-primary))}.mat-step-icon-state-done{background-color:var(--mat-stepper-header-done-state-icon-background-color);color:var(--mat-stepper-header-done-state-icon-foreground-color)}.mat-step-icon-state-edit{background-color:var(--mat-stepper-header-edit-state-icon-background-color, var(--mat-sys-primary));color:var(--mat-stepper-header-edit-state-icon-foreground-color, var(--mat-sys-on-primary))}'],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatStepHeader, [{
    type: Component,
    args: [{
      selector: "mat-step-header",
      host: {
        "class": "mat-step-header",
        "[class]": '"mat-" + (color || "primary")',
        "role": "tab"
      },
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [MatRipple, NgTemplateOutlet, MatIcon],
      template: `<div class="mat-step-header-ripple mat-focus-indicator" matRipple
     [matRippleTrigger]="_getHostElement()"
     [matRippleDisabled]="disableRipple"></div>

<div class="mat-step-icon-state-{{state}} mat-step-icon" [class.mat-step-icon-selected]="selected">
  <div class="mat-step-icon-content">
    @if (iconOverrides && iconOverrides[state]) {
      <ng-container
        [ngTemplateOutlet]="iconOverrides[state]"
        [ngTemplateOutletContext]="_getIconContext()"></ng-container>
    } @else {
      @switch (state) {
        @case ('number') {
          <span aria-hidden="true">{{_getDefaultTextForState(state)}}</span>
        }

        @default {
          @if (state === 'done') {
            <span class="cdk-visually-hidden">{{_intl.completedLabel}}</span>
          } @else if (state === 'edit') {
            <span class="cdk-visually-hidden">{{_intl.editableLabel}}</span>
          }

          <mat-icon aria-hidden="true">{{_getDefaultTextForState(state)}}</mat-icon>
        }
      }
    }
  </div>
</div>
<div class="mat-step-label"
     [class.mat-step-label-active]="active"
     [class.mat-step-label-selected]="selected"
     [class.mat-step-label-error]="state == 'error'">
  @if (_templateLabel(); as templateLabel) {
    <!-- If there is a label template, use it. -->
    <div class="mat-step-text-label">
      <ng-container [ngTemplateOutlet]="templateLabel.template"></ng-container>
    </div>
  } @else if (_stringLabel()) {
    <!-- If there is no label template, fall back to the text label. -->
    <div class="mat-step-text-label">{{label}}</div>
  }

  @if (optional && state != 'error') {
    <div class="mat-step-optional">{{_intl.optionalLabel}}</div>
  }

  @if (state === 'error') {
    <div class="mat-step-sub-label-error">{{errorMessage}}</div>
  }
</div>

`,
      styles: ['.mat-step-header{overflow:hidden;outline:none;cursor:pointer;position:relative;box-sizing:content-box;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-step-header:focus .mat-focus-indicator::before{content:""}.mat-step-header:hover[aria-disabled=true]{cursor:default}.mat-step-header:hover:not([aria-disabled]),.mat-step-header:hover[aria-disabled=false]{background-color:var(--mat-stepper-header-hover-state-layer-color, color-mix(in srgb, var(--mat-sys-inverse-surface) calc(var(--mat-sys-hover-state-layer-opacity) * 100%), transparent));border-radius:var(--mat-stepper-header-hover-state-layer-shape, var(--mat-sys-corner-medium))}.mat-step-header.cdk-keyboard-focused,.mat-step-header.cdk-program-focused{background-color:var(--mat-stepper-header-focus-state-layer-color, color-mix(in srgb, var(--mat-sys-inverse-surface) calc(var(--mat-sys-focus-state-layer-opacity) * 100%), transparent));border-radius:var(--mat-stepper-header-focus-state-layer-shape, var(--mat-sys-corner-medium))}@media(hover: none){.mat-step-header:hover{background:none}}@media(forced-colors: active){.mat-step-header{outline:solid 1px}.mat-step-header[aria-selected=true] .mat-step-label{text-decoration:underline}.mat-step-header[aria-disabled=true]{outline-color:GrayText}.mat-step-header[aria-disabled=true] .mat-step-label,.mat-step-header[aria-disabled=true] .mat-step-icon,.mat-step-header[aria-disabled=true] .mat-step-optional{color:GrayText}}.mat-step-optional{font-size:12px;color:var(--mat-stepper-header-optional-label-text-color, var(--mat-sys-on-surface-variant))}.mat-step-sub-label-error{font-size:12px;font-weight:normal}.mat-step-icon{border-radius:50%;height:24px;width:24px;flex-shrink:0;position:relative;color:var(--mat-stepper-header-icon-foreground-color, var(--mat-sys-surface));background-color:var(--mat-stepper-header-icon-background-color, var(--mat-sys-on-surface-variant))}.mat-step-icon-content{position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);display:flex}.mat-step-icon .mat-icon{font-size:16px;height:16px;width:16px}.mat-step-icon-state-error{background-color:var(--mat-stepper-header-error-state-icon-background-color, transparent);color:var(--mat-stepper-header-error-state-icon-foreground-color, var(--mat-sys-error))}.mat-step-icon-state-error .mat-icon{font-size:24px;height:24px;width:24px}.mat-step-label{display:inline-block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:50px;vertical-align:middle;font-family:var(--mat-stepper-header-label-text-font, var(--mat-sys-title-small-font));font-size:var(--mat-stepper-header-label-text-size, var(--mat-sys-title-small-size));font-weight:var(--mat-stepper-header-label-text-weight, var(--mat-sys-title-small-weight));color:var(--mat-stepper-header-label-text-color, var(--mat-sys-on-surface-variant))}.mat-step-label.mat-step-label-active{color:var(--mat-stepper-header-selected-state-label-text-color, var(--mat-sys-on-surface-variant))}.mat-step-label.mat-step-label-error{color:var(--mat-stepper-header-error-state-label-text-color, var(--mat-sys-error));font-size:var(--mat-stepper-header-error-state-label-text-size, var(--mat-sys-title-small-size))}.mat-step-label.mat-step-label-selected{font-size:var(--mat-stepper-header-selected-state-label-text-size, var(--mat-sys-title-small-size));font-weight:var(--mat-stepper-header-selected-state-label-text-weight, var(--mat-sys-title-small-weight))}.mat-step-text-label{text-overflow:ellipsis;overflow:hidden}.mat-step-header .mat-step-header-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-step-icon-selected{background-color:var(--mat-stepper-header-selected-state-icon-background-color, var(--mat-sys-primary));color:var(--mat-stepper-header-selected-state-icon-foreground-color, var(--mat-sys-on-primary))}.mat-step-icon-state-done{background-color:var(--mat-stepper-header-done-state-icon-background-color);color:var(--mat-stepper-header-done-state-icon-foreground-color)}.mat-step-icon-state-edit{background-color:var(--mat-stepper-header-edit-state-icon-background-color, var(--mat-sys-primary));color:var(--mat-stepper-header-edit-state-icon-foreground-color, var(--mat-sys-on-primary))}']
    }]
  }], () => [], {
    state: [{
      type: Input
    }],
    label: [{
      type: Input
    }],
    errorMessage: [{
      type: Input
    }],
    iconOverrides: [{
      type: Input
    }],
    index: [{
      type: Input
    }],
    selected: [{
      type: Input
    }],
    active: [{
      type: Input
    }],
    optional: [{
      type: Input
    }],
    disableRipple: [{
      type: Input
    }],
    color: [{
      type: Input
    }]
  });
})();
var MatStepperIcon = class _MatStepperIcon {
  templateRef = inject(TemplateRef);
  /** Name of the icon to be overridden. */
  name;
  constructor() {
  }
  static ɵfac = function MatStepperIcon_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatStepperIcon)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _MatStepperIcon,
    selectors: [["ng-template", "matStepperIcon", ""]],
    inputs: {
      name: [0, "matStepperIcon", "name"]
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatStepperIcon, [{
    type: Directive,
    args: [{
      selector: "ng-template[matStepperIcon]"
    }]
  }], () => [], {
    name: [{
      type: Input,
      args: ["matStepperIcon"]
    }]
  });
})();
var MatStepContent = class _MatStepContent {
  _template = inject(TemplateRef);
  constructor() {
  }
  static ɵfac = function MatStepContent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatStepContent)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _MatStepContent,
    selectors: [["ng-template", "matStepContent", ""]]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatStepContent, [{
    type: Directive,
    args: [{
      selector: "ng-template[matStepContent]"
    }]
  }], () => [], null);
})();
var MatStep = class _MatStep extends CdkStep {
  _errorStateMatcher = inject(ErrorStateMatcher, {
    skipSelf: true
  });
  _viewContainerRef = inject(ViewContainerRef);
  _isSelected = Subscription.EMPTY;
  /** Content for step label given by `<ng-template matStepLabel>`. */
  // We need an initializer here to avoid a TS error.
  stepLabel = void 0;
  /**
   * Theme color for the particular step. This API is supported in M2 themes
   * only, it has no effect in M3 themes. For color customization in M3, see https://material.angular.io/components/stepper/styling.
   *
   * For information on applying color variants in M3, see
   * https://material.angular.io/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
   */
  color;
  /** Content that will be rendered lazily. */
  _lazyContent;
  /** Currently-attached portal containing the lazy content. */
  _portal;
  ngAfterContentInit() {
    this._isSelected = this._stepper.steps.changes.pipe(switchMap(() => {
      return this._stepper.selectionChange.pipe(map((event) => event.selectedStep === this), startWith(this._stepper.selected === this));
    })).subscribe((isSelected) => {
      if (isSelected && this._lazyContent && !this._portal) {
        this._portal = new TemplatePortal(this._lazyContent._template, this._viewContainerRef);
      }
    });
  }
  ngOnDestroy() {
    this._isSelected.unsubscribe();
  }
  /** Custom error state matcher that additionally checks for validity of interacted form. */
  isErrorState(control, form) {
    const originalErrorState = this._errorStateMatcher.isErrorState(control, form);
    const customErrorState = !!(control && control.invalid && this.interacted);
    return originalErrorState || customErrorState;
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵMatStep_BaseFactory;
    return function MatStep_Factory(__ngFactoryType__) {
      return (ɵMatStep_BaseFactory || (ɵMatStep_BaseFactory = ɵɵgetInheritedFactory(_MatStep)))(__ngFactoryType__ || _MatStep);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _MatStep,
    selectors: [["mat-step"]],
    contentQueries: function MatStep_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuery(dirIndex, MatStepLabel, 5);
        ɵɵcontentQuery(dirIndex, MatStepContent, 5);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.stepLabel = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx._lazyContent = _t.first);
      }
    },
    hostAttrs: ["hidden", ""],
    inputs: {
      color: "color"
    },
    exportAs: ["matStep"],
    features: [ɵɵProvidersFeature([{
      provide: ErrorStateMatcher,
      useExisting: _MatStep
    }, {
      provide: CdkStep,
      useExisting: _MatStep
    }]), ɵɵInheritDefinitionFeature],
    ngContentSelectors: _c03,
    decls: 1,
    vars: 0,
    consts: [[3, "cdkPortalOutlet"]],
    template: function MatStep_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵtemplate(0, MatStep_ng_template_0_Template, 2, 1, "ng-template");
      }
    },
    dependencies: [CdkPortalOutlet],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatStep, [{
    type: Component,
    args: [{
      selector: "mat-step",
      providers: [{
        provide: ErrorStateMatcher,
        useExisting: MatStep
      }, {
        provide: CdkStep,
        useExisting: MatStep
      }],
      encapsulation: ViewEncapsulation.None,
      exportAs: "matStep",
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [CdkPortalOutlet],
      host: {
        "hidden": ""
        // Hide the steps so they don't affect the layout.
      },
      template: '<ng-template>\n  <ng-content></ng-content>\n  <ng-template [cdkPortalOutlet]="_portal"></ng-template>\n</ng-template>\n'
    }]
  }], null, {
    stepLabel: [{
      type: ContentChild,
      args: [MatStepLabel]
    }],
    color: [{
      type: Input
    }],
    _lazyContent: [{
      type: ContentChild,
      args: [MatStepContent, {
        static: false
      }]
    }]
  });
})();
var MatStepper = class _MatStepper extends CdkStepper {
  _ngZone = inject(NgZone);
  _renderer = inject(Renderer2);
  _animationsModule = inject(ANIMATION_MODULE_TYPE, {
    optional: true
  });
  _cleanupTransition;
  _isAnimating = signal(false);
  /** The list of step headers of the steps in the stepper. */
  _stepHeader = void 0;
  /** Elements hosting the step animations. */
  _animatedContainers;
  /** Full list of steps inside the stepper, including inside nested steppers. */
  _steps = void 0;
  /** Steps that belong to the current stepper, excluding ones from nested steppers. */
  steps = new QueryList();
  /** Custom icon overrides passed in by the consumer. */
  _icons;
  /** Event emitted when the current step is done transitioning in. */
  animationDone = new EventEmitter();
  /** Whether ripples should be disabled for the step headers. */
  disableRipple;
  /**
   * Theme color for all of the steps in stepper. This API is supported in M2
   * themes only, it has no effect in M3 themes. For color customization in M3, see https://material.angular.io/components/stepper/styling.
   *
   * For information on applying color variants in M3, see
   * https://material.angular.io/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
   */
  color;
  /**
   * Whether the label should display in bottom or end position.
   * Only applies in the `horizontal` orientation.
   */
  labelPosition = "end";
  /**
   * Position of the stepper's header.
   * Only applies in the `horizontal` orientation.
   */
  headerPosition = "top";
  /** Consumer-specified template-refs to be used to override the header icons. */
  _iconOverrides = {};
  /** Duration for the animation. Will be normalized to milliseconds if no units are set. */
  get animationDuration() {
    return this._animationDuration;
  }
  set animationDuration(value) {
    this._animationDuration = /^\d+$/.test(value) ? value + "ms" : value;
  }
  _animationDuration = "";
  /** Whether the stepper is rendering on the server. */
  _isServer = !inject(Platform).isBrowser;
  constructor() {
    super();
    const elementRef = inject(ElementRef);
    const nodeName = elementRef.nativeElement.nodeName.toLowerCase();
    this.orientation = nodeName === "mat-vertical-stepper" ? "vertical" : "horizontal";
  }
  ngAfterContentInit() {
    super.ngAfterContentInit();
    this._icons.forEach(({
      name,
      templateRef
    }) => this._iconOverrides[name] = templateRef);
    this.steps.changes.pipe(takeUntil(this._destroyed)).subscribe(() => this._stateChanged());
    this.selectedIndexChange.pipe(takeUntil(this._destroyed)).subscribe(() => {
      const duration = this._getAnimationDuration();
      if (duration === "0ms" || duration === "0s") {
        this._onAnimationDone();
      } else {
        this._isAnimating.set(true);
      }
    });
    this._ngZone.runOutsideAngular(() => {
      if (this._animationsModule !== "NoopAnimations") {
        setTimeout(() => {
          this._elementRef.nativeElement.classList.add("mat-stepper-animations-enabled");
          this._cleanupTransition = this._renderer.listen(this._elementRef.nativeElement, "transitionend", this._handleTransitionend);
        }, 200);
      }
    });
  }
  ngAfterViewInit() {
    super.ngAfterViewInit();
    if (typeof queueMicrotask === "function") {
      let hasEmittedInitial = false;
      this._animatedContainers.changes.pipe(startWith(null), takeUntil(this._destroyed)).subscribe(() => queueMicrotask(() => {
        if (!hasEmittedInitial) {
          hasEmittedInitial = true;
          this.animationDone.emit();
        }
        this._stateChanged();
      }));
    }
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    this._cleanupTransition?.();
  }
  _stepIsNavigable(index, step) {
    return step.completed || this.selectedIndex === index || !this.linear;
  }
  _getAnimationDuration() {
    if (this._animationsModule === "NoopAnimations") {
      return "0ms";
    }
    if (this.animationDuration) {
      return this.animationDuration;
    }
    return this.orientation === "horizontal" ? "500ms" : "225ms";
  }
  _handleTransitionend = (event) => {
    const target = event.target;
    if (!target) {
      return;
    }
    const isHorizontalActiveElement = this.orientation === "horizontal" && event.propertyName === "transform" && target.classList.contains("mat-horizontal-stepper-content-current");
    const isVerticalActiveElement = this.orientation === "vertical" && event.propertyName === "grid-template-rows" && target.classList.contains("mat-vertical-content-container-active");
    const shouldEmit = (isHorizontalActiveElement || isVerticalActiveElement) && this._animatedContainers.find((ref) => ref.nativeElement === target);
    if (shouldEmit) {
      this._onAnimationDone();
    }
  };
  _onAnimationDone() {
    this._isAnimating.set(false);
    this.animationDone.emit();
  }
  static ɵfac = function MatStepper_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatStepper)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _MatStepper,
    selectors: [["mat-stepper"], ["mat-vertical-stepper"], ["mat-horizontal-stepper"], ["", "matStepper", ""]],
    contentQueries: function MatStepper_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuery(dirIndex, MatStep, 5);
        ɵɵcontentQuery(dirIndex, MatStepperIcon, 5);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx._steps = _t);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx._icons = _t);
      }
    },
    viewQuery: function MatStepper_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuery(MatStepHeader, 5);
        ɵɵviewQuery(_c1, 5);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx._stepHeader = _t);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx._animatedContainers = _t);
      }
    },
    hostAttrs: ["role", "tablist"],
    hostVars: 15,
    hostBindings: function MatStepper_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("aria-orientation", ctx.orientation);
        ɵɵstyleProp("--mat-stepper-animation-duration", ctx._getAnimationDuration());
        ɵɵclassProp("mat-stepper-horizontal", ctx.orientation === "horizontal")("mat-stepper-vertical", ctx.orientation === "vertical")("mat-stepper-label-position-end", ctx.orientation === "horizontal" && ctx.labelPosition == "end")("mat-stepper-label-position-bottom", ctx.orientation === "horizontal" && ctx.labelPosition == "bottom")("mat-stepper-header-position-bottom", ctx.headerPosition === "bottom")("mat-stepper-animating", ctx._isAnimating());
      }
    },
    inputs: {
      disableRipple: "disableRipple",
      color: "color",
      labelPosition: "labelPosition",
      headerPosition: "headerPosition",
      animationDuration: "animationDuration"
    },
    outputs: {
      animationDone: "animationDone"
    },
    exportAs: ["matStepper", "matVerticalStepper", "matHorizontalStepper"],
    features: [ɵɵProvidersFeature([{
      provide: CdkStepper,
      useExisting: _MatStepper
    }]), ɵɵInheritDefinitionFeature],
    ngContentSelectors: _c03,
    decls: 5,
    vars: 2,
    consts: [["stepTemplate", ""], ["animatedContainer", ""], [1, "mat-horizontal-stepper-wrapper"], [1, "mat-horizontal-stepper-header-container"], [1, "mat-horizontal-content-container"], ["role", "tabpanel", 1, "mat-horizontal-stepper-content", 3, "id", "class"], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], [1, "mat-stepper-horizontal-line"], ["role", "tabpanel", 1, "mat-horizontal-stepper-content", 3, "id"], [3, "ngTemplateOutlet"], [1, "mat-step"], [1, "mat-vertical-content-container"], ["role", "tabpanel", 1, "mat-vertical-stepper-content", 3, "id"], [1, "mat-vertical-content"], [3, "click", "keydown", "tabIndex", "id", "index", "state", "label", "selected", "active", "optional", "errorMessage", "iconOverrides", "disableRipple", "color"]],
    template: function MatStepper_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵtemplate(0, MatStepper_Conditional_0_Template, 1, 0)(1, MatStepper_Case_1_Template, 7, 0, "div", 2)(2, MatStepper_Case_2_Template, 2, 0)(3, MatStepper_ng_template_3_Template, 1, 23, "ng-template", null, 0, ɵɵtemplateRefExtractor);
      }
      if (rf & 2) {
        let tmp_2_0;
        ɵɵconditional(ctx._isServer ? 0 : -1);
        ɵɵadvance();
        ɵɵconditional((tmp_2_0 = ctx.orientation) === "horizontal" ? 1 : tmp_2_0 === "vertical" ? 2 : -1);
      }
    },
    dependencies: [NgTemplateOutlet, MatStepHeader],
    styles: ['.mat-stepper-vertical,.mat-stepper-horizontal{display:block;font-family:var(--mat-stepper-container-text-font, var(--mat-sys-body-medium-font));background:var(--mat-stepper-container-color, var(--mat-sys-surface))}.mat-horizontal-stepper-header-container{white-space:nowrap;display:flex;align-items:center}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header-container{align-items:flex-start}.mat-stepper-header-position-bottom .mat-horizontal-stepper-header-container{order:1}.mat-stepper-horizontal-line{border-top-width:1px;border-top-style:solid;flex:auto;height:0;margin:0 -16px;min-width:32px;border-top-color:var(--mat-stepper-line-color, var(--mat-sys-outline))}.mat-stepper-label-position-bottom .mat-stepper-horizontal-line{margin:0;min-width:0;position:relative;top:calc(calc((var(--mat-stepper-header-height, 72px) - 24px) / 2) + 12px)}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::before,.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::after,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::after{border-top-width:1px;border-top-style:solid;content:"";display:inline-block;height:0;position:absolute;width:calc(50% - 20px)}.mat-horizontal-stepper-header{display:flex;height:72px;overflow:hidden;align-items:center;padding:0 24px;height:var(--mat-stepper-header-height, 72px)}.mat-horizontal-stepper-header .mat-step-icon{margin-right:8px;flex:none}[dir=rtl] .mat-horizontal-stepper-header .mat-step-icon{margin-right:0;margin-left:8px}.mat-horizontal-stepper-header::before,.mat-horizontal-stepper-header::after{border-top-color:var(--mat-stepper-line-color, var(--mat-sys-outline))}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header{padding:calc((var(--mat-stepper-header-height, 72px) - 24px) / 2) 24px}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header::before,.mat-stepper-label-position-bottom .mat-horizontal-stepper-header::after{top:calc(calc((var(--mat-stepper-header-height, 72px) - 24px) / 2) + 12px)}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header{box-sizing:border-box;flex-direction:column;height:auto}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::after,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::after{right:0}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::before{left:0}[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:last-child::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:first-child::after{display:none}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header .mat-step-icon{margin-right:0;margin-left:0}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header .mat-step-label{padding:16px 0 0 0;text-align:center;width:100%}.mat-vertical-stepper-header{display:flex;align-items:center;height:24px;padding:calc((var(--mat-stepper-header-height, 72px) - 24px) / 2) 24px}.mat-vertical-stepper-header .mat-step-icon{margin-right:12px}[dir=rtl] .mat-vertical-stepper-header .mat-step-icon{margin-right:0;margin-left:12px}.mat-horizontal-stepper-wrapper{display:flex;flex-direction:column}.mat-horizontal-stepper-content{visibility:hidden;overflow:hidden;outline:0;height:0}.mat-stepper-animations-enabled .mat-horizontal-stepper-content{transition:transform var(--mat-stepper-animation-duration, 0) cubic-bezier(0.35, 0, 0.25, 1)}.mat-horizontal-stepper-content.mat-horizontal-stepper-content-previous{transform:translate3d(-100%, 0, 0)}.mat-horizontal-stepper-content.mat-horizontal-stepper-content-next{transform:translate3d(100%, 0, 0)}.mat-horizontal-stepper-content.mat-horizontal-stepper-content-current{visibility:visible;transform:none;height:auto}.mat-stepper-horizontal:not(.mat-stepper-animating) .mat-horizontal-stepper-content.mat-horizontal-stepper-content-current{overflow:visible}.mat-horizontal-content-container{overflow:hidden;padding:0 24px 24px 24px}@media(forced-colors: active){.mat-horizontal-content-container{outline:solid 1px}}.mat-stepper-header-position-bottom .mat-horizontal-content-container{padding:24px 24px 0 24px}.mat-vertical-content-container{display:grid;grid-template-rows:0fr;grid-template-columns:100%;margin-left:36px;border:0;position:relative}.mat-stepper-animations-enabled .mat-vertical-content-container{transition:grid-template-rows var(--mat-stepper-animation-duration, 0) cubic-bezier(0.4, 0, 0.2, 1)}.mat-vertical-content-container.mat-vertical-content-container-active{grid-template-rows:1fr}.mat-step:last-child .mat-vertical-content-container{border:none}@media(forced-colors: active){.mat-vertical-content-container{outline:solid 1px}}[dir=rtl] .mat-vertical-content-container{margin-left:0;margin-right:36px}@supports not (grid-template-rows: 0fr){.mat-vertical-content-container{height:0}.mat-vertical-content-container.mat-vertical-content-container-active{height:auto}}.mat-stepper-vertical-line::before{content:"";position:absolute;left:0;border-left-width:1px;border-left-style:solid;border-left-color:var(--mat-stepper-line-color, var(--mat-sys-outline));top:calc(8px - calc((var(--mat-stepper-header-height, 72px) - 24px) / 2));bottom:calc(8px - calc((var(--mat-stepper-header-height, 72px) - 24px) / 2))}[dir=rtl] .mat-stepper-vertical-line::before{left:auto;right:0}.mat-vertical-stepper-content{overflow:hidden;outline:0;visibility:hidden}.mat-stepper-animations-enabled .mat-vertical-stepper-content{transition:visibility var(--mat-stepper-animation-duration, 0) linear}.mat-vertical-content-container-active>.mat-vertical-stepper-content{visibility:visible}.mat-vertical-content{padding:0 24px 24px 24px}'],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatStepper, [{
    type: Component,
    args: [{
      selector: "mat-stepper, mat-vertical-stepper, mat-horizontal-stepper, [matStepper]",
      exportAs: "matStepper, matVerticalStepper, matHorizontalStepper",
      host: {
        "[class.mat-stepper-horizontal]": 'orientation === "horizontal"',
        "[class.mat-stepper-vertical]": 'orientation === "vertical"',
        "[class.mat-stepper-label-position-end]": 'orientation === "horizontal" && labelPosition == "end"',
        "[class.mat-stepper-label-position-bottom]": 'orientation === "horizontal" && labelPosition == "bottom"',
        "[class.mat-stepper-header-position-bottom]": 'headerPosition === "bottom"',
        "[class.mat-stepper-animating]": "_isAnimating()",
        "[style.--mat-stepper-animation-duration]": "_getAnimationDuration()",
        "[attr.aria-orientation]": "orientation",
        "role": "tablist"
      },
      providers: [{
        provide: CdkStepper,
        useExisting: MatStepper
      }],
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [NgTemplateOutlet, MatStepHeader],
      template: `<!--
  We need to project the content somewhere to avoid hydration errors. Some observations:
  1. This is only necessary on the server.
  2. We get a hydration error if there aren't any nodes after the \`ng-content\`.
  3. We get a hydration error if \`ng-content\` is wrapped in another element.
-->
@if (_isServer) {
  <ng-content/>
}

@switch (orientation) {
  @case ('horizontal') {
    <div class="mat-horizontal-stepper-wrapper">
      <div class="mat-horizontal-stepper-header-container">
        @for (step of steps; track step) {
          <ng-container
            [ngTemplateOutlet]="stepTemplate"
            [ngTemplateOutletContext]="{step, i: $index}"/>
          @if (!$last) {
            <div class="mat-stepper-horizontal-line"></div>
          }
        }
      </div>

      <div class="mat-horizontal-content-container">
        @for (step of steps; track step) {
          <div
            #animatedContainer
            class="mat-horizontal-stepper-content"
            role="tabpanel"
            [id]="_getStepContentId($index)"
            [attr.aria-labelledby]="_getStepLabelId($index)"
            [class]="'mat-horizontal-stepper-content-' + _getAnimationDirection($index)"
            [attr.inert]="selectedIndex === $index ? null : ''">
            <ng-container [ngTemplateOutlet]="step.content"/>
          </div>
        }
      </div>
    </div>
  }

  @case ('vertical') {
    @for (step of steps; track step) {
      <div class="mat-step">
        <ng-container
          [ngTemplateOutlet]="stepTemplate"
          [ngTemplateOutletContext]="{step, i: $index}"/>
        <div
          #animatedContainer
          class="mat-vertical-content-container"
          [class.mat-stepper-vertical-line]="!$last"
          [class.mat-vertical-content-container-active]="selectedIndex === $index"
          [attr.inert]="selectedIndex === $index ? null : ''">
          <div class="mat-vertical-stepper-content"
            role="tabpanel"
            [id]="_getStepContentId($index)"
            [attr.aria-labelledby]="_getStepLabelId($index)">
            <div class="mat-vertical-content">
              <ng-container [ngTemplateOutlet]="step.content"/>
            </div>
          </div>
        </div>
      </div>
    }
  }
}

<!-- Common step templating -->
<ng-template let-step="step" let-i="i" #stepTemplate>
  <mat-step-header
    [class.mat-horizontal-stepper-header]="orientation === 'horizontal'"
    [class.mat-vertical-stepper-header]="orientation === 'vertical'"
    (click)="step.select()"
    (keydown)="_onKeydown($event)"
    [tabIndex]="_getFocusIndex() === i ? 0 : -1"
    [id]="_getStepLabelId(i)"
    [attr.aria-posinset]="i + 1"
    [attr.aria-setsize]="steps.length"
    [attr.aria-controls]="_getStepContentId(i)"
    [attr.aria-selected]="selectedIndex == i"
    [attr.aria-label]="step.ariaLabel || null"
    [attr.aria-labelledby]="(!step.ariaLabel && step.ariaLabelledby) ? step.ariaLabelledby : null"
    [attr.aria-disabled]="_stepIsNavigable(i, step) ? null : true"
    [index]="i"
    [state]="_getIndicatorType(i, step.state)"
    [label]="step.stepLabel || step.label"
    [selected]="selectedIndex === i"
    [active]="_stepIsNavigable(i, step)"
    [optional]="step.optional"
    [errorMessage]="step.errorMessage"
    [iconOverrides]="_iconOverrides"
    [disableRipple]="disableRipple || !_stepIsNavigable(i, step)"
    [color]="step.color || color"/>
</ng-template>
`,
      styles: ['.mat-stepper-vertical,.mat-stepper-horizontal{display:block;font-family:var(--mat-stepper-container-text-font, var(--mat-sys-body-medium-font));background:var(--mat-stepper-container-color, var(--mat-sys-surface))}.mat-horizontal-stepper-header-container{white-space:nowrap;display:flex;align-items:center}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header-container{align-items:flex-start}.mat-stepper-header-position-bottom .mat-horizontal-stepper-header-container{order:1}.mat-stepper-horizontal-line{border-top-width:1px;border-top-style:solid;flex:auto;height:0;margin:0 -16px;min-width:32px;border-top-color:var(--mat-stepper-line-color, var(--mat-sys-outline))}.mat-stepper-label-position-bottom .mat-stepper-horizontal-line{margin:0;min-width:0;position:relative;top:calc(calc((var(--mat-stepper-header-height, 72px) - 24px) / 2) + 12px)}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::before,.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::after,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::after{border-top-width:1px;border-top-style:solid;content:"";display:inline-block;height:0;position:absolute;width:calc(50% - 20px)}.mat-horizontal-stepper-header{display:flex;height:72px;overflow:hidden;align-items:center;padding:0 24px;height:var(--mat-stepper-header-height, 72px)}.mat-horizontal-stepper-header .mat-step-icon{margin-right:8px;flex:none}[dir=rtl] .mat-horizontal-stepper-header .mat-step-icon{margin-right:0;margin-left:8px}.mat-horizontal-stepper-header::before,.mat-horizontal-stepper-header::after{border-top-color:var(--mat-stepper-line-color, var(--mat-sys-outline))}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header{padding:calc((var(--mat-stepper-header-height, 72px) - 24px) / 2) 24px}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header::before,.mat-stepper-label-position-bottom .mat-horizontal-stepper-header::after{top:calc(calc((var(--mat-stepper-header-height, 72px) - 24px) / 2) + 12px)}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header{box-sizing:border-box;flex-direction:column;height:auto}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::after,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::after{right:0}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::before{left:0}[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:last-child::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:first-child::after{display:none}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header .mat-step-icon{margin-right:0;margin-left:0}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header .mat-step-label{padding:16px 0 0 0;text-align:center;width:100%}.mat-vertical-stepper-header{display:flex;align-items:center;height:24px;padding:calc((var(--mat-stepper-header-height, 72px) - 24px) / 2) 24px}.mat-vertical-stepper-header .mat-step-icon{margin-right:12px}[dir=rtl] .mat-vertical-stepper-header .mat-step-icon{margin-right:0;margin-left:12px}.mat-horizontal-stepper-wrapper{display:flex;flex-direction:column}.mat-horizontal-stepper-content{visibility:hidden;overflow:hidden;outline:0;height:0}.mat-stepper-animations-enabled .mat-horizontal-stepper-content{transition:transform var(--mat-stepper-animation-duration, 0) cubic-bezier(0.35, 0, 0.25, 1)}.mat-horizontal-stepper-content.mat-horizontal-stepper-content-previous{transform:translate3d(-100%, 0, 0)}.mat-horizontal-stepper-content.mat-horizontal-stepper-content-next{transform:translate3d(100%, 0, 0)}.mat-horizontal-stepper-content.mat-horizontal-stepper-content-current{visibility:visible;transform:none;height:auto}.mat-stepper-horizontal:not(.mat-stepper-animating) .mat-horizontal-stepper-content.mat-horizontal-stepper-content-current{overflow:visible}.mat-horizontal-content-container{overflow:hidden;padding:0 24px 24px 24px}@media(forced-colors: active){.mat-horizontal-content-container{outline:solid 1px}}.mat-stepper-header-position-bottom .mat-horizontal-content-container{padding:24px 24px 0 24px}.mat-vertical-content-container{display:grid;grid-template-rows:0fr;grid-template-columns:100%;margin-left:36px;border:0;position:relative}.mat-stepper-animations-enabled .mat-vertical-content-container{transition:grid-template-rows var(--mat-stepper-animation-duration, 0) cubic-bezier(0.4, 0, 0.2, 1)}.mat-vertical-content-container.mat-vertical-content-container-active{grid-template-rows:1fr}.mat-step:last-child .mat-vertical-content-container{border:none}@media(forced-colors: active){.mat-vertical-content-container{outline:solid 1px}}[dir=rtl] .mat-vertical-content-container{margin-left:0;margin-right:36px}@supports not (grid-template-rows: 0fr){.mat-vertical-content-container{height:0}.mat-vertical-content-container.mat-vertical-content-container-active{height:auto}}.mat-stepper-vertical-line::before{content:"";position:absolute;left:0;border-left-width:1px;border-left-style:solid;border-left-color:var(--mat-stepper-line-color, var(--mat-sys-outline));top:calc(8px - calc((var(--mat-stepper-header-height, 72px) - 24px) / 2));bottom:calc(8px - calc((var(--mat-stepper-header-height, 72px) - 24px) / 2))}[dir=rtl] .mat-stepper-vertical-line::before{left:auto;right:0}.mat-vertical-stepper-content{overflow:hidden;outline:0;visibility:hidden}.mat-stepper-animations-enabled .mat-vertical-stepper-content{transition:visibility var(--mat-stepper-animation-duration, 0) linear}.mat-vertical-content-container-active>.mat-vertical-stepper-content{visibility:visible}.mat-vertical-content{padding:0 24px 24px 24px}']
    }]
  }], () => [], {
    _stepHeader: [{
      type: ViewChildren,
      args: [MatStepHeader]
    }],
    _animatedContainers: [{
      type: ViewChildren,
      args: ["animatedContainer"]
    }],
    _steps: [{
      type: ContentChildren,
      args: [MatStep, {
        descendants: true
      }]
    }],
    _icons: [{
      type: ContentChildren,
      args: [MatStepperIcon, {
        descendants: true
      }]
    }],
    animationDone: [{
      type: Output
    }],
    disableRipple: [{
      type: Input
    }],
    color: [{
      type: Input
    }],
    labelPosition: [{
      type: Input
    }],
    headerPosition: [{
      type: Input
    }],
    animationDuration: [{
      type: Input
    }]
  });
})();
var MatStepperNext = class _MatStepperNext extends CdkStepperNext {
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵMatStepperNext_BaseFactory;
    return function MatStepperNext_Factory(__ngFactoryType__) {
      return (ɵMatStepperNext_BaseFactory || (ɵMatStepperNext_BaseFactory = ɵɵgetInheritedFactory(_MatStepperNext)))(__ngFactoryType__ || _MatStepperNext);
    };
  })();
  static ɵdir = ɵɵdefineDirective({
    type: _MatStepperNext,
    selectors: [["button", "matStepperNext", ""]],
    hostAttrs: [1, "mat-stepper-next"],
    hostVars: 1,
    hostBindings: function MatStepperNext_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵhostProperty("type", ctx.type);
      }
    },
    features: [ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatStepperNext, [{
    type: Directive,
    args: [{
      selector: "button[matStepperNext]",
      host: {
        "class": "mat-stepper-next",
        "[type]": "type"
      }
    }]
  }], null, null);
})();
var MatStepperPrevious = class _MatStepperPrevious extends CdkStepperPrevious {
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵMatStepperPrevious_BaseFactory;
    return function MatStepperPrevious_Factory(__ngFactoryType__) {
      return (ɵMatStepperPrevious_BaseFactory || (ɵMatStepperPrevious_BaseFactory = ɵɵgetInheritedFactory(_MatStepperPrevious)))(__ngFactoryType__ || _MatStepperPrevious);
    };
  })();
  static ɵdir = ɵɵdefineDirective({
    type: _MatStepperPrevious,
    selectors: [["button", "matStepperPrevious", ""]],
    hostAttrs: [1, "mat-stepper-previous"],
    hostVars: 1,
    hostBindings: function MatStepperPrevious_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵhostProperty("type", ctx.type);
      }
    },
    features: [ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatStepperPrevious, [{
    type: Directive,
    args: [{
      selector: "button[matStepperPrevious]",
      host: {
        "class": "mat-stepper-previous",
        "[type]": "type"
      }
    }]
  }], null, null);
})();
var MatStepperModule = class _MatStepperModule {
  static ɵfac = function MatStepperModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatStepperModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _MatStepperModule,
    imports: [MatCommonModule, PortalModule, CdkStepperModule, MatIconModule, MatRippleModule, MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious, MatStepHeader, MatStepperIcon, MatStepContent],
    exports: [MatCommonModule, MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious, MatStepHeader, MatStepperIcon, MatStepContent]
  });
  static ɵinj = ɵɵdefineInjector({
    providers: [MAT_STEPPER_INTL_PROVIDER, ErrorStateMatcher],
    imports: [MatCommonModule, PortalModule, CdkStepperModule, MatIconModule, MatRippleModule, MatStepper, MatStepHeader, MatCommonModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatStepperModule, [{
    type: NgModule,
    args: [{
      imports: [MatCommonModule, PortalModule, CdkStepperModule, MatIconModule, MatRippleModule, MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious, MatStepHeader, MatStepperIcon, MatStepContent],
      exports: [MatCommonModule, MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious, MatStepHeader, MatStepperIcon, MatStepContent],
      providers: [MAT_STEPPER_INTL_PROVIDER, ErrorStateMatcher]
    }]
  }], null, null);
})();
var matStepperAnimations = {
  // Represents:
  // trigger('horizontalStepTransition', [
  //   state('previous', style({transform: 'translate3d(-100%, 0, 0)', visibility: 'hidden'})),
  //   // Transition to `inherit`, rather than `visible`,
  //   // because visibility on a child element the one from the parent,
  //   // making this element focusable inside of a `hidden` element.
  //   state('current', style({transform: 'none', visibility: 'inherit'})),
  //   state('next', style({transform: 'translate3d(100%, 0, 0)', visibility: 'hidden'})),
  //   transition(
  //     '* => *',
  //     group([
  //       animate('{{animationDuration}} cubic-bezier(0.35, 0, 0.25, 1)'),
  //       query('@*', animateChild(), {optional: true}),
  //     ]),
  //     {
  //       params: {animationDuration: '500ms'},
  //     },
  //   ),
  // ])
  /** Animation that transitions the step along the X axis in a horizontal stepper. */
  horizontalStepTransition: {
    type: 7,
    name: "horizontalStepTransition",
    definitions: [{
      type: 0,
      name: "previous",
      styles: {
        type: 6,
        styles: {
          transform: "translate3d(-100%, 0, 0)",
          visibility: "hidden"
        },
        offset: null
      }
    }, {
      type: 0,
      name: "current",
      styles: {
        type: 6,
        styles: {
          transform: "none",
          visibility: "inherit"
        },
        offset: null
      }
    }, {
      type: 0,
      name: "next",
      styles: {
        type: 6,
        styles: {
          transform: "translate3d(100%, 0, 0)",
          visibility: "hidden"
        },
        offset: null
      }
    }, {
      type: 1,
      expr: "* => *",
      animation: {
        type: 3,
        steps: [{
          type: 4,
          styles: null,
          timings: "{{animationDuration}} cubic-bezier(0.35, 0, 0.25, 1)"
        }, {
          type: 11,
          selector: "@*",
          animation: {
            type: 9,
            options: null
          },
          options: {
            optional: true
          }
        }],
        options: null
      },
      options: {
        params: {
          animationDuration: "500ms"
        }
      }
    }],
    options: {}
  },
  // Represents:
  // trigger('verticalStepTransition', [
  //   state('previous', style({height: '0px', visibility: 'hidden'})),
  //   state('next', style({height: '0px', visibility: 'hidden'})),
  //   // Transition to `inherit`, rather than `visible`,
  //   // because visibility on a child element the one from the parent,
  //   // making this element focusable inside of a `hidden` element.
  //   state('current', style({height: '*', visibility: 'inherit'})),
  //   transition(
  //     '* <=> current',
  //     group([
  //       animate('{{animationDuration}} cubic-bezier(0.4, 0.0, 0.2, 1)'),
  //       query('@*', animateChild(), {optional: true}),
  //     ]),
  //     {
  //       params: {animationDuration: '225ms'},
  //     },
  //   ),
  // ])
  /** Animation that transitions the step along the Y axis in a vertical stepper. */
  verticalStepTransition: {
    type: 7,
    name: "verticalStepTransition",
    definitions: [{
      type: 0,
      name: "previous",
      styles: {
        type: 6,
        styles: {
          "height": "0px",
          visibility: "hidden"
        },
        offset: null
      }
    }, {
      type: 0,
      name: "next",
      styles: {
        type: 6,
        styles: {
          "height": "0px",
          visibility: "hidden"
        },
        offset: null
      }
    }, {
      type: 0,
      name: "current",
      styles: {
        type: 6,
        styles: {
          "height": "*",
          visibility: "inherit"
        },
        offset: null
      }
    }, {
      type: 1,
      expr: "* <=> current",
      animation: {
        type: 3,
        steps: [{
          type: 4,
          styles: null,
          timings: "{{animationDuration}} cubic-bezier(0.4, 0.0, 0.2, 1)"
        }, {
          type: 11,
          selector: "@*",
          animation: {
            type: 9,
            options: null
          },
          options: {
            optional: true
          }
        }],
        options: null
      },
      options: {
        params: {
          animationDuration: "225ms"
        }
      }
    }],
    options: {}
  }
};
export {
  MAT_STEPPER_INTL_PROVIDER,
  MAT_STEPPER_INTL_PROVIDER_FACTORY,
  MatStep,
  MatStepContent,
  MatStepHeader,
  MatStepLabel,
  MatStepper,
  MatStepperIcon,
  MatStepperIntl,
  MatStepperModule,
  MatStepperNext,
  MatStepperPrevious,
  matStepperAnimations
};
//# sourceMappingURL=@angular_material_stepper.js.map
