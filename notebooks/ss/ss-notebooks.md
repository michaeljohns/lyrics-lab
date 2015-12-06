#Scott's Notebook(s)

Contents of this directory-

### Notebooks:
**GetGenres** acquires song metadata from 1970 to 2014 directly from wikipedia ala HW1. Produces 
  "master_lyrics_with_all_years_genres.csv" a dataframe with metadata, column for each genre with true or false, and joined on song_key with the lyrics set. It is in the local directory and in lyrics-lab/data/conditioned. Notebook contains explanatory text only. Stores files in /tempdata subdirectory which should be ignored. 
  
  -master_lyrics_with_all_years_genres.csv  
  -songsbygenre.json  a dict keyed by genre and returning a list of each song_key in that genre  
  -genresbysong.json  keyed by song_key, returns list of genres  


**Word_Clouds**  uses the above-mentioned dataframe to build word clouds. obtains aggregate word ferequency across years and genres, and frequencies from decade subsets and from genre subsets. It produces wordclouds from [the python library published by Andreas Mueller](https://github.com/amueller/word_cloud). They are not pretty. Accordingly the frequency data is stored in one json object for data partitioned by decade called "decade_word_frequency.json", and another for data partitioned by genre, "genre_word_frequency.json."       
-decade_word_frequency.json  
-genre_word_frequency.json

**LDA-LSI** Runs the basic HW5 style LDA analysis on the corpus as a whole, and then on the corpus partiioned according to decade. Similarly runs LSI analysis on the same subsets. It stores "lsi_decade_topics.json" and "lda_decade_topics.json" in the local directory. Each is keyed on the decade (as integer) and returns a dict of topics for that decade keyed by topic number. The topic items are tuples with word and calculated weighting.  Inside the notebook there is a fair amount of copy, and the topic groups are printed. It was first built witht he calls to spark under vagrant, but those results were cached and subsequent runs have not required spark, so the spark calls are commented out. The whole thing runs in less than ten minutes. STILL TO DO: see if another notebook can be built that will develop corpus from genre-subset data and compare topics across genres.

-lsi_decade_topics.json  
-lda_decade_topics.json  

**LexicalDiversity** This one looks at the vocabulary-to-wordcount ratio and calls its inverse the repetition index. It currently operates only at the decade level, with genre level operation expected soon. At present it leaves behind a big ass all-inclusive data set, all_years_and genres_with_lyrics_and_wordcount_and_vocabulary.csv, and several small json object:

-wordcount_by_decade.json  
-wordset_by_decade.json  
-wordset_by_year.json  
-wordcount_by_year.json
-all_years_and genres_with_lyrics_and_wordcount_and_vocabulary.csv
