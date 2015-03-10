# Upgrade to 0.7

## Field factory

ng-admin 0.7 breaks compatibility with 0.5 and makes the "factories" configuration API compulsory. If your configuration uses `nga.field()`, it will still work woth 0.7. If it uses `new Field()`, you'll need to follow [the 0.6 upgrade guide](https://github.com/marmelab/ng-admin/blob/b3c7b1afc6a52651df6ba4454d8461620339b4da/UPGRADE-0.6.md).

## Configuration factory

The configuration is now done through the `AdminDescription` object. You can retrieve it directly from Angular DI. You just have to retrieve your application from this factory instead of the `NgAdminConfigurationProvider` as previously. In addition, `NgAdminConfigurationProvider` was renamed to `NgAdminProvider`:

``` diff
- app.config(function (NgAdminConfigurationProvider, RestangularProvider) {
+ app.config(function (AdminDescription, NgAdminProvider, RestangularProvider) {
-     var nga = NgAdminConfigurationProvider;
+     var nga = AdminDescription;

      // ...

-     nga.configure(admin);
+     NgAdminProvider.configure(admin);
  });
```