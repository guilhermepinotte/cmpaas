from django.db import models


class Map(models.Model):
    title = models.CharField(max_length=200)
    created_at = models.DateTimeField('date published')

    def __str__(self):              # __unicode__ on Python 2
        return self.title

class Concept(models.Model):
    idMap = models.ForeignKey(Map)
    text = models.CharField(max_length=200)
    loc = models.IntegerField(default=0)

    def __str__(self):              # __unicode__ on Python 2
        return self.text

class Link(models.Model):
    idMap = models.ForeignKey(Map)
    idConceptFrom = models.ForeignKey(Concept)
    # idConceptTo = models.ForeignKey(Concept)
    text = models.CharField(max_length=200)
    loc = models.IntegerField(default=0)

    def __str__(self):              # __unicode__ on Python 2
        return self.text