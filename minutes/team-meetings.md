#Team Meeting minutes

##11/22
* invited TF to participate
* Kevin
  * Progress:
    * __(MJ will fill in during meeting)__
  * Goals for week:
    * __(MJ will fill in during meeting)__
* Michael:
  * Progress:
    1. data exploration notebook
      1. vocabs for noun and adj
      1. n-gram for noun and adj
      1. synonyms for noun and adj
      1. hypernyms for noun and adj
    1. missing data notebook
      1. able to leverage api from lyrics.wikia
      1. obtained missing lyric abstracts for ~850 songs (only 1 was missing expected data)
      1. identified new process to combine provided songs meta with lyrics.wikia
        1. maintain the following from provided: year, position, artist, song, wikipedia url
        1. maintain the following from existing conditioning: song_key which is a string of 'year-position'
        1. augment with lyrics.wikia: lyric abstract (for display within website), full lyrics url (for linking to help user explore complete lyrics)
        1. behind the scenes, will process full lyrics but not display them to users in website
    1. new process
  * Goals for week:
    1. process all lyrics into new format reflecting lessons learned
    1. consolidate to a vocab shrunk to hypernyms and synonyms (allows other analytics based on commonalities)
    1. split out decade-centric
    1. process 2015?
    1. process prior to 1970? (involves some Billboard scraping )
    1. possible ensemble processing with additional spark.ml support
* Scott:
  * Progress:
    * __(MJ will fill in during meeting)__
  * Goals for week:
    * __(MJ will fill in during meeting)__

##11/29
