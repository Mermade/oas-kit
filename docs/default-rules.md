---

# OAS-Kit Default Linter Rules

<table class="table table-striped table-inverted">
  <thead>
    <tr>
      <td>Name</td>
      <td>OpenAPI Object</td>
      <td>Description</td>
    </tr>
  </thead>
  <tbody>
  {% for rule in site.data.defaultrules.default %}
  <tr>
    <td id="{{ rule.name }}">
      <a href="#{{ rule.name }}">{{ rule.name }}</a>
    </td>
    <td>
        {% if rule.object == "*" %}
        <em>everything</em>
        {% elsif rule.version == "3.1" %}
        <a href="https://spec.openapis.org/oas/v3.1.0.html#{{ rule.object }}-object">{{ rule.object }}</a> (3.1.x only)
        {% else %}
        <a href="https://spec.openapis.org/oas/v3.0.3.html#{{ rule.object }}-object">{{ rule.object }}</a>{% if rule.version == "3.0" %} (3.0.x only){% endif %}
        {% endif %}
    </td>
    <td>{{ rule.description }}</td>
  </tr>
  <!-- <tr>
    <td colspan=3>{{ rule.more | markdownify }}</td>
  </tr> -->
  {% endfor %}
  </tbody>
</table>

