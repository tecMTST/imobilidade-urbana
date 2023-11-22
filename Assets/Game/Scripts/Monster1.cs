using UnityEngine;
using System.Collections.Generic;
using Unity.VisualScripting;

public class Monster1 : MonoBehaviour
{
    public float delay = 2f;

    public UnityEngine.Rendering.Universal.Light2D light2D;
    public Transform playerObject;
    public Transform[] targetObject;
    public float moveSpeedNormal = 2f;
    public float moveSpeedLight = 5f;
    public GameObject player;
    public int monsterRoomIndex;
    
    [Tooltip("The limit the player can be hidden with the torchlight on")]
    public float expositionTimeLimit;

    private float lightExpositionTime;
    private float stoppingDistance = 1f;
    private bool shouldMove = false;
    private Collider2D thisCollider;
    private bool isNearPlayer = false;
    private int index = 0;

    //Áudio:
    private AudioSource audioSource;

    //Lista de SFX:
    [SerializeField] private AudioClip sfxVoice1;
    [SerializeField] private AudioClip sfxVoice2;

    //Variáveis Áudio:
    [SerializeField] private float limitVoice = 8f;
    private float timerVoice = 0f;
    private int typeVoice = 1;

    void Start()
    {
        Invoke("StartMoving", delay);
        thisCollider = this.GetComponent<Collider2D>();
        audioSource = GetComponent<AudioSource>();

        
    }


    void Update()
    {



        List<Collider2D> colliders = new ();
        ContactFilter2D contactFilter = new ContactFilter2D();
        contactFilter.NoFilter();
        
        thisCollider.OverlapCollider(contactFilter, colliders);

        bool sameRoom = (monsterRoomIndex == player.GetComponent<PlayerController>().GetRoomIndex());

        if (Vector3.Distance(this.transform.position, player.transform.position) < 8) 
        {
            isNearPlayer = true;
        }
        else
        {
            isNearPlayer = false;
        }

        if (light2D.enabled && isNearPlayer && sameRoom)
        {
            Vector3 direction = playerObject.position - transform.position;
            direction.Normalize();
            transform.Translate(direction * moveSpeedLight * Time.deltaTime, Space.World);

            if (direction.magnitude > stoppingDistance) {
               
                if (!light2D.enabled)
                    lightExpositionTime = 0;

            } else {
                
                if (light2D.enabled)
                    lightExpositionTime += Time.deltaTime;

                if (lightExpositionTime > 5) {
                    GameManagement.Instance.SetPlayerPosition();
                    lightExpositionTime = 0;

                }

            }


            }else if (shouldMove) {

                Vector3 direction = targetObject[index].position - transform.position;
            

                if (direction.magnitude > stoppingDistance)
                {
                    direction.Normalize();
                    transform.Translate(direction * moveSpeedNormal * Time.deltaTime, Space.World);

                }
                else
                {
                    shouldMove = false;

                    lightExpositionTime = 0;

                    Invoke("StartMoving", delay);

                    if (index == targetObject.Length - 1)
                    {
                        index = 0;
                    }
                    else
                    {
                        index++;
                    }
                }
            } 

        //SFX Grunindos:
        timerVoice = timerVoice + Time.deltaTime;
        if (timerVoice > limitVoice)
        {
            switch (typeVoice)
            {
                case 1:
                    audioSource.PlayOneShot(sfxVoice1);
                    typeVoice = 2;
                    timerVoice = 0f;
                    break;

                case 2:
                    audioSource.PlayOneShot(sfxVoice2);
                    typeVoice = 1;
                    timerVoice = 0f;
                    break;
            }
        }

    }

    void StartMoving()
    {        
        shouldMove = true;
    }
}
