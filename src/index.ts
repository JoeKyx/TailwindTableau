import { DashboardObject } from '@tableau/extensions-api-types';

class TailwindTableau {
  constructor(private _$: JQueryStatic) {}

  public async initialize() {
    console.log('init');
    $('body').empty();
    await tableau.extensions.setClickThroughAsync(true);
    const dashboard = tableau.extensions.dashboardContent.dashboard;
    dashboard.objects.forEach((obj) => {
      this.render(obj);
    });
  }

  private separateText(input: string): {
    insideQuotes: string[];
    outsideQuotes: string;
  } {
    // Match text inside quotes
    const insideQuotes = [...input.matchAll(/"([^"]*)"/g)].map(
      (match) => match[1]
    );

    // Remove text inside quotes from the original string to get the outside text
    const outsideQuotes = input.replace(/"[^"]*"/g, '').trim();

    return { insideQuotes, outsideQuotes };
  }

  private getMarginFromObjClasses(objClasses: string | undefined) {
    const margin = [0, 0, 0, 0];
    if (!objClasses) return margin;
    const classNames = objClasses.split(/\s+/);
    classNames.reverse();
    const marginClass = classNames.find((cl) => cl.startsWith('margin-'));
    if (!marginClass) return margin;

    const marginValues = marginClass
      .split('-')
      .splice(1)
      .map((val) => parseInt(val));
    if (marginValues.length === 1) {
      const [all] = marginValues;
      return [all, all, all, all];
    }
    if (marginValues.length === 2) {
      const [vertical, horizontal] = marginValues;
      return [vertical, horizontal, vertical, horizontal];
    }
    if (marginValues.length === 3) {
      const [top, horizontal, bottom] = marginValues;
      return [top, horizontal, bottom, horizontal];
    }
    if (marginValues.length === 4) {
      return marginValues;
    }
    return margin;
  }

  async render(obj: DashboardObject) {
    const objNameAndClasses = obj.name.split('|');
    const objTextAndId = objNameAndClasses[0];
    // Check if objIdAndPossiblyText contains "text" if yes, split it out int const text
    const objIdAndPossiblyText = this.separateText(objTextAndId);
    const objClasses = objNameAndClasses[1];
    const textClasses = objNameAndClasses[2];
    const margin = this.getMarginFromObjClasses(objClasses);
    const props = {
      id: objIdAndPossiblyText.outsideQuotes || obj.id,
      css: {
        position: 'absolute',
        top: `${obj.position.y + margin[0]}px`,
        left: `${obj.position.x + margin[3]}px`,
        width: `${obj.size.width - margin[1] - margin[3]}px`,
        height: `${obj.size.height - margin[0] - margin[2]}px`,
      },
    };
    const $div = this._$('<div>', props);
    // Add <p> tags for each text inside quotes
    objIdAndPossiblyText.insideQuotes.forEach((text) => {
      const $p = this._$('<p>', {
        text,
      });
      $p.addClass(textClasses);
      $p.appendTo($div);
    });
    $div.addClass(objClasses);
    $div.appendTo('body');
  }

  public async start() {
    $(() => {
      tableau.extensions.initializeAsync().then(
        () => {
          this.initialize();
          // Register an event handler for Dashboard Object resize
          // Supports automatic sized dashboards and reloads

          tableau.extensions.dashboardContent.dashboard.addEventListener(
            tableau.TableauEventType.DashboardLayoutChanged,
            this.initialize.bind(this)
          );
        },
        (err) => {
          console.log('Broken', err.message);
        }
      );
    });
  }
}

// Create an instance of your class and start it
const tailwindTableau = new TailwindTableau($);
tailwindTableau.start();
