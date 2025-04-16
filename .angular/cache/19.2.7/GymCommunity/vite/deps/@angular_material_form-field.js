import {
  MatFormFieldModule
<<<<<<< Updated upstream
} from "./chunk-SPZDXKXW.js";
=======
<<<<<<< HEAD
} from "./chunk-PH3YIXTY.js";
=======
} from "./chunk-SPZDXKXW.js";
>>>>>>> df8fb4d01c87985d7eb8c019e80c5c78cde16e16
>>>>>>> Stashed changes
import {
  MAT_ERROR,
  MAT_FORM_FIELD,
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MAT_PREFIX,
  MAT_SUFFIX,
  MatError,
  MatFormField,
  MatFormFieldControl,
  MatHint,
  MatLabel,
  MatPrefix,
  MatSuffix,
  getMatFormFieldDuplicatedHintError,
  getMatFormFieldMissingControlError,
  getMatFormFieldPlaceholderConflictError
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
} from "./chunk-OYBZWOE6.js";
import "./chunk-6HCHJRUV.js";
import "./chunk-LLSYBTIE.js";
import "./chunk-M3HR6BUY.js";
import "./chunk-NGVXFTMT.js";
import "./chunk-WL4WQQIA.js";
import "./chunk-YBP6BAAT.js";
import "./chunk-YBK6EBUC.js";
import "./chunk-4VAIYRI4.js";
=======
>>>>>>> Stashed changes
} from "./chunk-TA6LPQGB.js";
import "./chunk-2NE43QZO.js";
import "./chunk-M3HR6BUY.js";
import "./chunk-LLSYBTIE.js";
import "./chunk-GOSVRJIQ.js";
import "./chunk-VC3ERYFJ.js";
import "./chunk-TBPBL5EG.js";
import "./chunk-67Q4LKMM.js";
import "./chunk-DITTXYZP.js";
>>>>>>> df8fb4d01c87985d7eb8c019e80c5c78cde16e16
import "./chunk-EFOSVCYK.js";

// node_modules/@angular/material/fesm2022/form-field.mjs
var matFormFieldAnimations = {
  // Represents:
  // trigger('transitionMessages', [
  //   // TODO(mmalerba): Use angular animations for label animation as well.
  //   state('enter', style({opacity: 1, transform: 'translateY(0%)'})),
  //   transition('void => enter', [
  //     style({opacity: 0, transform: 'translateY(-5px)'}),
  //     animate('300ms cubic-bezier(0.55, 0, 0.55, 0.2)'),
  //   ]),
  // ])
  /** Animation that transitions the form field's error and hint messages. */
  transitionMessages: {
    type: 7,
    name: "transitionMessages",
    definitions: [{
      type: 0,
      name: "enter",
      styles: {
        type: 6,
        styles: {
          opacity: 1,
          transform: "translateY(0%)"
        },
        offset: null
      }
    }, {
      type: 1,
      expr: "void => enter",
      animation: [{
        type: 6,
        styles: {
          opacity: 0,
          transform: "translateY(-5px)"
        },
        offset: null
      }, {
        type: 4,
        styles: null,
        timings: "300ms cubic-bezier(0.55, 0, 0.55, 0.2)"
      }],
      options: null
    }],
    options: {}
  }
};
export {
  MAT_ERROR,
  MAT_FORM_FIELD,
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MAT_PREFIX,
  MAT_SUFFIX,
  MatError,
  MatFormField,
  MatFormFieldControl,
  MatFormFieldModule,
  MatHint,
  MatLabel,
  MatPrefix,
  MatSuffix,
  getMatFormFieldDuplicatedHintError,
  getMatFormFieldMissingControlError,
  getMatFormFieldPlaceholderConflictError,
  matFormFieldAnimations
};
//# sourceMappingURL=@angular_material_form-field.js.map
