import Entry from 'admin-config/lib/Entry';

function maEmbeddedListField() {
    return {
        scope: {
            'field': '&',
            'value': '=',
            'datastore': '&'
        },
        restrict: 'E',
        link: {
            pre: function(scope) {
                const field = scope.field();
                const targetEntity = field.targetEntity();
                const targetEntityName = targetEntity.name();
                const targetFields = field.targetFields();
                const sortField = field.sortField();
                const sortDir = field.sortDir() === 'DESC' ? -1 : 1;
                var filterFunc;
                if (field.permanentFilters()) {
                    const filters = field.permanentFilters();
                    const filterKeys = Object.keys(filters);
                    filterFunc = (entry) => {
                        return filterKeys.reduce((isFiltered, key) => isFiltered && entry.values[key] == filters[key], true)
                    }
                } else {
                    filterFunc = () => true;
                }
                scope.fields = targetFields;
                scope.entries = Entry
                    .createArrayFromRest(scope.value, targetFields, targetEntityName, targetEntity.identifier().name())
                    .sort((entry1, entry2) => sortDir * (entry1.values[sortField] - entry2.values[sortField]))
                    .filter(filterFunc);
                scope.addNew = () => scope.entries.unshift(Entry.createForFields(targetFields));
                scope.remove = entry => {
                    scope.entries = scope.entries.filter(e => e !== entry);
                };
                scope.$watch('entries', (newEntries, oldEntries) => {
                    if (newEntries === oldEntries) return;
                    scope.value = newEntries.map(e => e.transformToRest(targetFields))
                }, true);
            }
        },
        template: `
<div class="row">
    <ng-form ng-repeat="entry in entries track by $index" class="subentry" name="subform_{{$index}}" ng-init="formName = 'subform_' + $index">
        <div class="pull-right">
                <a class="btn btn-default btn-sm" ng-click="remove(entry)"><span class="glyphicon glyphicon-minus-sign" aria-hidden="true"></span>&nbsp;Remove</a>
        </div>
        <div class="form-field form-group" ng-repeat="field in ::fields track by $index">
            <ma-field field="::field" value="entry.values[field.name()]" entry="entry" entity="::entity" form="formName" datastore="::datastore()"></ma-field>
        </div>
        <hr/>
    </ng-form>
    <div class="form-group">
        <div class="col-sm-offset-2 col-sm-10">
            <a class="btn btn-default btn-sm" ng-click="addNew()"><span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span>&nbsp;Add new {{ field().name() }}</a>
        </div>
    </div>
</div>`
    };
}

maEmbeddedListField.$inject = [];

module.exports = maEmbeddedListField;

