#Scott's Notebook(s)
First commit is the extension of the conditioned data to lda. The nounword2id index uses strings for keys and these had to be converted to integers. The size of our data is smaller than the HW5 example, so a smaller chunksize was chosen. It also appears to be relatively fast when passes is greater than one, but without (yet) understanding the rationale for doing that I left it alone. The lda is set to run with an arbitraty number of topics and print them out in readable format. Fixed the issue with the lda.get_document_topics(bow) function's access of nounid2words index. Same as before, looking for integergs, getting strings. SHould have known. 

Researching LDS on the gensim site it looked like LSA could be run immediately an d it was. 

Still not sure about how to integrate the hyper words or haw to do the next step toward NB analysis of adjectives without using spark. Or I guess I could open the spark environment..... 
